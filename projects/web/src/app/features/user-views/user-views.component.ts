import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { DEFAULT_PAGINATION_OPTIONS } from '@knb/core/constants/pagination';
import { Blog } from '@knb/core/models/blog';
import { Pagination } from '@knb/core/models/pagination';
import { User } from '@knb/core/models/user';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { accumulativePagination } from '@knb/core/utils/rxjs/paginate';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { Observable, of, shareReplay } from 'rxjs';

/** User views component. */
@Component({
  selector: 'knw-user-views',
  standalone: true,
  templateUrl: './user-views.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AsyncPipe, BlogPreviewComponent, UserPreviewComponent, MatButtonModule],
  styleUrls: ['./user-views.component.scss'],
})
export class UserViewsComponent {
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly userApiService = inject(UserApiService);

  protected readonly blogsPage$: Observable<Pagination<Blog>>;
  protected readonly usersPage$: Observable<Pagination<User>>;
  protected readonly isLoading = signal(false);
  protected readonly currentPageSignal = signal(DEFAULT_PAGINATION_OPTIONS.pageNumber);

  private readonly currentPage$ = toObservable(this.currentPageSignal);

  public constructor() {
    this.blogsPage$ = this.initializeBlogsPage();
    this.usersPage$ = this.initializeUsersPage();
  }

  private initializeBlogsPage(): Observable<Pagination<Blog>> {
    return accumulativePagination(
      // Using `debounceTime(0)` here to make the filter emits only 1 time after all changes has synchronously emitted.
      // eslint-disable-next-line rxjs/finnish
      { currentPage: this.currentPage$ },
      ({ currentPage }) =>
        this.blogsApiService
          .getBlogs({ ...DEFAULT_PAGINATION_OPTIONS, userId: null, pageNumber: currentPage })
          .pipe(toggleExecutionState(this.isLoading)),
      of(null),
    ).pipe(filterNull(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  private initializeUsersPage(): Observable<Pagination<User>> {
    return this.userApiService
      .getUsers({ ...DEFAULT_PAGINATION_OPTIONS, pageSize: 5 })
      .pipe(toggleExecutionState(this.isLoading), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  protected onLoadMoreClick() {
    this.currentPageSignal.update((currentPage) => currentPage + 1);
  }
}

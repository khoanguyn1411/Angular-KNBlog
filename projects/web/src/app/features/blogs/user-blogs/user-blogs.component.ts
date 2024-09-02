import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_PAGINATION_OPTIONS } from '@knb/core/constants/pagination';
import { Blog } from '@knb/core/models/blog';
import { Pagination } from '@knb/core/models/pagination';
import { User } from '@knb/core/models/user';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { accumulativePagination } from '@knb/core/utils/rxjs/paginate';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { USER_ID_PARAM } from 'projects/web/src/shared/web-route-paths';
import { map, Observable, of, shareReplay } from 'rxjs';

/** User blogs component. */
@Component({
  selector: 'knw-user-blogs',
  standalone: true,
  templateUrl: './user-blogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, BlogPreviewComponent, MatButtonModule],
  styleUrl: './user-blogs.component.scss',
})
export class UserBlogsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogsApiService = inject(BlogsApiService);

  protected readonly blogsPage$: Observable<Pagination<Blog>>;
  protected readonly isLoading = signal(false);
  protected readonly currentPageSignal = signal(DEFAULT_PAGINATION_OPTIONS.pageNumber);

  private readonly userId$ = this.createUserIdStream();
  private readonly currentPage$ = toObservable(this.currentPageSignal);

  public constructor() {
    this.blogsPage$ = this.initializeBlogsPage();
  }

  private createUserIdStream(): Observable<User['id'] | null> {
    return this.route.paramMap.pipe(
      map((params) => params.get(USER_ID_PARAM)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  private initializeBlogsPage(): Observable<Pagination<Blog>> {
    return accumulativePagination(
      // Using `debounceTime(0)` here to make the filter emits only 1 time after all changes has synchronously emitted.
      // eslint-disable-next-line rxjs/finnish
      { currentPage: this.currentPage$, userId: this.userId$ },
      ({ currentPage, userId }) =>
        this.blogsApiService
          .getBlogs({ ...DEFAULT_PAGINATION_OPTIONS, userId, pageNumber: currentPage, search: '' })
          .pipe(toggleExecutionState(this.isLoading)),
      of(null),
    ).pipe(filterNull(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  protected onLoadMoreClick() {
    this.currentPageSignal.update((currentPage) => currentPage + 1);
  }
}

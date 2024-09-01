import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { DEFAULT_PAGINATION_OPTIONS } from '@knb/core/constants/pagination';
import { Blog } from '@knb/core/models/blog';
import { Pagination } from '@knb/core/models/pagination';
import { User } from '@knb/core/models/user';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { UserApiService } from '@knb/core/services/api-services/user-api.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { UserPreviewComponent } from '@knb/shared/components/user-preview/user-preview.component';
import { Observable } from 'rxjs';

/** User views component. */
@Component({
  selector: 'knw-user-views',
  standalone: true,
  templateUrl: './user-views.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AsyncPipe, BlogPreviewComponent, UserPreviewComponent],
  styleUrls: ['./user-views.component.scss'],
})
export class UserViewsComponent {
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly userApiService = inject(UserApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly blogsPage$: Observable<Pagination<Blog>>;
  protected readonly usersPage$: Observable<Pagination<User>>;
  protected readonly isLoading = signal(false);

  public constructor() {
    this.blogsPage$ = this.blogsApiService
      .getBlogs(DEFAULT_PAGINATION_OPTIONS)
      .pipe(toggleExecutionState(this.isLoading), takeUntilDestroyed(this.destroyRef));

    this.usersPage$ = this.userApiService
      .getUsers({ ...DEFAULT_PAGINATION_OPTIONS, pageSize: 5 })
      .pipe(toggleExecutionState(this.isLoading), takeUntilDestroyed(this.destroyRef));
  }
}

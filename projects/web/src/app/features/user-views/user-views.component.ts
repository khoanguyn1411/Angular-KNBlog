import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Blog } from '@knb/core/models/blog';
import { Pagination } from '@knb/core/models/pagination';
import { BlogsApiService } from '@knb/core/services/api-services/blogs-api.service';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { BlogPreviewComponent } from '@knb/shared/components/blog-preview/blog-preview.component';
import { Observable } from 'rxjs';

/** User views component. */
@Component({
  selector: 'knw-user-views',
  standalone: true,
  templateUrl: './user-views.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AsyncPipe, BlogPreviewComponent],
  styleUrls: ['./user-views.component.scss'],
})
export class UserViewsComponent {
  private readonly blogsApiService = inject(BlogsApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly blogsPage$: Observable<Pagination<Blog>>;
  protected readonly isLoading = signal(false);

  public constructor() {
    this.blogsPage$ = this.blogsApiService
      .getBlogs()
      .pipe(toggleExecutionState(this.isLoading), takeUntilDestroyed(this.destroyRef));
  }
}

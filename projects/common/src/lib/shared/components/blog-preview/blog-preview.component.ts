import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Blog } from '@knb/core/models/blog';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { AvatarComponent } from '../avatar/avatar.component';
import { UserPreviewComponent } from '../user-preview/user-preview.component';

/** Blog preview component. */
@Component({
  selector: 'knc-blog-preview',
  standalone: true,
  templateUrl: './blog-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './blog-preview.component.scss',
  imports: [AvatarComponent, UserPreviewComponent, RouterModule, MatButtonModule, DatePipe, MatIconModule],
})
export class BlogPreviewComponent {
  public readonly blog = input.required<Blog>();

  protected readonly routePaths = injectWebAppRoutes();

  protected readonly detailUrl = computed(() => this.routePaths.blogs.children.detail.url({ blogId: this.blog().id }));

  protected readonly totalLike = signal(0);
  protected readonly isBlogLiked = signal(false);

  /**
   * Handle like button clicked.
   * @param event Mouse event.
   */
  protected onLikeClicked(event: MouseEvent) {
    event.stopPropagation();
    this.isBlogLiked.set(true);
    this.totalLike.update((likeCount) => likeCount + 1);
  }

  /**
   * Handle unlike button clicked.
   * @param event Mouse event.
   */
  protected onUnlikeClicked(event: MouseEvent) {
    event.stopPropagation();
    this.isBlogLiked.set(false);
    this.totalLike.update((likeCount) => likeCount - 1);
  }

  private setIsPostLikedEffect = effect(
    () => {
      // this.isBlogLiked.set(true);
    },
    { allowSignalWrites: true },
  );

  private setTotalLikeEffect = effect(
    () => {
      this.totalLike.set(this.blog().emoticonCount);
    },
    { allowSignalWrites: true },
  );
}

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Blog } from '@knb/core/models/blog';
import { EmoticonApiService } from '@knb/core/services/api-services/emoticon-api.service';

/** Emoticon button component. */
@Component({
  selector: 'knc-emoticon-button',
  standalone: true,
  templateUrl: './emoticon-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule],
  styleUrl: './emoticon-button.component.scss',
})
export class EmoticonButtonComponent {
  public readonly totalBlogLike = input.required<number>();
  public readonly blogId = input.required<Blog['id']>();

  private readonly emoticonApiService = inject(EmoticonApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly totalLike = signal(0);
  protected readonly isBlogLiked = signal(false);

  /**
   * Handle like button clicked.
   * @param event Mouse event.
   */
  protected onLikeClicked(event: MouseEvent) {
    event.stopPropagation();
    this.emoticonApiService
      .addEmoticon({ blogId: this.blogId() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.isBlogLiked.set(true);
    this.totalLike.update((likeCount) => likeCount + 1);
  }

  /**
   * Handle unlike button clicked.
   * @param event Mouse event.
   */
  protected onUnlikeClicked(event: MouseEvent) {
    event.stopPropagation();
    this.emoticonApiService.removeEmoticon(this.blogId()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
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
      this.totalLike.set(this.totalBlogLike());
    },
    { allowSignalWrites: true },
  );
}

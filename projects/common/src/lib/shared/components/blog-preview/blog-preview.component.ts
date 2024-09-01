import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Blog } from '@knb/core/models/blog';
import { AvatarComponent } from '../avatar/avatar.component';
import { UserPreviewComponent } from '../user-preview/user-preview.component';

/** Blog preview component. */
@Component({
  selector: 'knc-blog-preview',
  standalone: true,
  templateUrl: './blog-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './blog-preview.component.scss',
  imports: [AvatarComponent, UserPreviewComponent],
})
export class BlogPreviewComponent {
  public readonly blog = input.required<Blog>();
}

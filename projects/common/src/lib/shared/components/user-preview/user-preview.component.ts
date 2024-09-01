import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '@knb/core/models/user';
import { AvatarComponent } from '../avatar/avatar.component';

/** User preview component. */
@Component({
  selector: 'knc-user-preview',
  standalone: true,
  templateUrl: './user-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-preview.component.scss',
  imports: [AvatarComponent],
})
export class UserPreviewComponent {
  public readonly user = input.required<User>();
}

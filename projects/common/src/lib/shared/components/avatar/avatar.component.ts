import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '@knb/core/models/user';

/** Avatar component. */
@Component({
  selector: 'knc-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  public readonly user = input<User | null>(null)
  public readonly size = input<"small" | "medium" | "large">("medium")

  protected get firstLetterOfName() {
    const user = this.user()
    if(user == null){
      return "Anonymous"
    }
    return user.fullName.charAt(0).toUpperCase()
  }
}

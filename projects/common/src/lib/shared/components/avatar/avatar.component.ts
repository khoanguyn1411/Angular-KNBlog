import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '@knb/core/models/user';

/** Avatar component. */
@Component({
  selector: 'knc-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  public readonly user = input<User | null>(null);
  public readonly size = input<'small' | 'medium' | 'large'>('medium');

  protected readonly randomColor = this.getRandomColor();

  protected get firstLetterOfName() {
    const user = this.user();
    if (user == null) {
      return 'Anonymous';
    }
    return user.fullName.charAt(0).toUpperCase();
  }

  /** Generate a random color, which is good fit with white text. */
  protected getRandomColor(): string {
    const colors: string[] = [
      '#000080',
      '#006400',
      '#800020',
      '#36454F',
      '#301934',
      '#008080',
      '#228B22',
      '#FF4500',
      '#4169E1',
      '#DC143C',
      '#708090',
      '#556B2F',
      '#800000',
      '#4682B4',
      '#D2691E',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}

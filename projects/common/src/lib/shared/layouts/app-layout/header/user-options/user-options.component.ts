import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { AvatarComponent } from '@knb/shared/components/avatar/avatar.component';
import { first } from 'rxjs';

/** User options component. */
@Component({
  selector: 'knc-user-options',
  standalone: true,
  templateUrl: './user-options.component.html',
  imports: [AvatarComponent, MatMenuModule, MatDividerModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./user-options.component.scss'],
})
export class UserOptionsComponent {
  private readonly userService = inject(UserService);

  protected readonly currentUser = toSignal(this.userService.currentUser$);

  protected onSignOut() {
    this.userService.logout().pipe(first()).subscribe();
  }
}

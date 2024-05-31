import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@knb/core/services/api-services/user.service';
import { DialogService } from '@knb/core/services/ui-services/dialog.service';
import { AuthenticationDialogComponent, AuthenticationDialogData } from '@knb/shared/components/authentication/authentication-dialog.component';

import { first } from 'rxjs';

/** Header component. */
@Component({
  selector: 'knc-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss'],
  imports: [MatButtonModule],
})
export class HeaderComponent {
  private readonly dialogService = inject(DialogService);
  private readonly userService = inject(UserService);

  protected readonly isAuthorized = toSignal(this.userService.isAuthorized$);

  private openAuthenticationDialog(data: AuthenticationDialogData) {
    this.dialogService.open<AuthenticationDialogComponent, AuthenticationDialogData>(
      AuthenticationDialogComponent,
      data
    );
  }

  protected onSignIn() {
    this.openAuthenticationDialog({ state: 'signIn' });
  }

  protected onSignOut() {
    this.userService.logout().pipe(first()).subscribe();
  }
}

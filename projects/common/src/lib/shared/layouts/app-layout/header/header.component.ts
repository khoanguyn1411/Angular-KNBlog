import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '@knb/core/services/ui-services/dialog.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import {
  AuthenticationDialogComponent,
  AuthenticationDialogData,
} from '@knb/shared/components/authentication/authentication-dialog.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { UserOptionsComponent } from './user-options/user-options.component';

/** Header component. */
@Component({
  selector: 'knc-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss'],
  imports: [MatButtonModule, UserOptionsComponent, MatIconModule, GlobalSearchComponent],
})
export class HeaderComponent {
  private readonly dialogService = inject(DialogService);
  private readonly userService = inject(UserService);

  protected readonly isAuthorized = toSignal(this.userService.isAuthorized$);

  private openAuthenticationDialog(data: AuthenticationDialogData) {
    this.dialogService.open<AuthenticationDialogComponent, AuthenticationDialogData>(
      AuthenticationDialogComponent,
      data,
    );
  }

  protected onSignIn() {
    this.openAuthenticationDialog({ state: 'signIn' });
  }
}

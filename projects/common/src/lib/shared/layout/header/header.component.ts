import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@knb/core/services/ui-services/dialog.service';
import {
  AuthenticationComponent,
  AuthenticationDialogData,
} from '@knb/shared/components/authentication/authentication.component';

/** Header component. */
@Component({
  selector: 'knc-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.css'],
  imports: [MatButtonModule],
})
export class HeaderComponent {
  private readonly dialogService = inject(DialogService);

  private openAuthenticationDialog(data: AuthenticationDialogData) {
    this.dialogService.open<AuthenticationComponent, AuthenticationDialogData>(
      AuthenticationComponent,
      data
    );
  }

  protected onSignIn() {
    this.openAuthenticationDialog({ state: 'signIn' });
  }
}

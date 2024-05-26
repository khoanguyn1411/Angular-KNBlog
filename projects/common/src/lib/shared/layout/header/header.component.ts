import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
  private readonly dialogRef = inject(MatDialog);

  private openAuthenticationDialog(data: AuthenticationDialogData) {
    this.dialogRef.open<AuthenticationComponent, AuthenticationDialogData>(
      AuthenticationComponent,
      { data, minWidth: "500px" }
    );
  }

  protected onSignIn() {
    this.openAuthenticationDialog({ state: 'signIn' });
  }
}

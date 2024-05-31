import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export type AuthenticationDialogData = {
  readonly state: 'signIn' | 'signUp';
};

/** Authentication dialog component. */
@Component({
  selector: 'knc-authentication-dialog',
  standalone: true,
  templateUrl: './authentication-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, RegisterComponent],
  styleUrls: ['./authentication-dialog.component.scss'],
})
export class AuthenticationDialogComponent {
  protected readonly dialogData = inject<AuthenticationDialogData>(MAT_DIALOG_DATA);

  protected readonly authState = signal<AuthenticationDialogData>(
    this.dialogData
  );

  protected onSignup() {
    this.authState.set({ state: 'signUp' });
  }

  protected onSignIn() {
    this.authState.set({ state: 'signIn' });
  }
}

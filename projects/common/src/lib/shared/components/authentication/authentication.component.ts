import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export type AuthenticationDialogData = {
  readonly state: 'signIn' | 'signUp';
};

/** Authentication component. */
@Component({
  selector: 'knc-authentication',
  standalone: true,
  templateUrl: './authentication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, RegisterComponent],
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {
  protected readonly dialogData = inject<AuthenticationDialogData>(MAT_DIALOG_DATA)
}

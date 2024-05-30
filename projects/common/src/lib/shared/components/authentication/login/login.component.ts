import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LoginData } from '@knb/core/models/login-data';
import { AuthApiService } from '@knb/core/services/api-services/auth-api.service';
import { catchValidationData } from '@knb/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { DialogLayoutComponent } from '@knb/shared/layouts/dialog-layout/dialog-layout.component';
import { PasswordComponent } from '../../inputs/password/password.component';
import { LabelComponent } from '../../label/label.component';

type LoginFormData = FlatControlsOf<LoginData>;

/** Login component. */
@Component({
  selector: 'knc-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    DialogLayoutComponent,
    LabelComponent,
    PasswordComponent,
    LoadingDirective,
    GoogleSigninButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly signup = output();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);

  /** Whether form is loading. */
  protected readonly isLoading = signal(false);

  /** Login form. */
  protected readonly loginForm: FormGroup<LoginFormData>;

  public constructor() {
    this.loginForm = this.initLoginForm();
  }

  /** Handle 'submit' of the login form. */
  protected onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.authApiService
      .login(this.loginForm.getRawValue())
      .pipe(
        // Need to bind the context into set function to avoid unbound issue of class.
        // See: https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unbound-methods.md
        toggleExecutionState(this.isLoading.set.bind(this)),
        catchValidationData(this.loginForm),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onNavigateToSignup(): void {
    this.signup.emit();
  }

  private initLoginForm(): FormGroup<LoginFormData> {
    return this.fb.group<LoginFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
    });
  }
}

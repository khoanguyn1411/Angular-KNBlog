import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LoginData } from '@knb/core/models/login-data';
import { AuthApiService } from '@knb/core/services/api-services/auth-api.service';
import { catchValidationData } from '@knb/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { DialogLayoutComponent } from '@knb/shared/layouts/dialog-layout/dialog-layout.component';
import { BehaviorSubject } from 'rxjs';

type LoginFormData = FlatControlsOf<LoginData>;

/** Login component. */
@Component({
  selector: 'knc-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [InputComponent, ReactiveFormsModule, MatButtonModule, DialogLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);

  /** Is app loading. */
  protected readonly isLoading$ = new BehaviorSubject(false);

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
        toggleExecutionState(this.isLoading$),
        catchValidationData(this.loginForm),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private initLoginForm(): FormGroup<LoginFormData> {
    return this.fb.group<LoginFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
    });
  }
}

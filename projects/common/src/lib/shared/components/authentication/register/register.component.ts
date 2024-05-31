import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  signal,
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
import { RegisterData } from '@knb/core/models/register-data';
import { AuthApiService } from '@knb/core/services/api-services/auth-api.service';
import {
  catchValidationData
} from '@knb/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { DialogLayoutComponent } from '@knb/shared/layouts/dialog-layout/dialog-layout.component';
import { AlertComponent } from '../../alert/alert.component';
import { PasswordComponent } from '../../inputs/password/password.component';
import { LabelComponent } from '../../label/label.component';

type RegisterFormData = FlatControlsOf<
  RegisterData & {
    readonly confirmPassword: string;
  }
>;

/** Register component. */
@Component({
  selector: 'knc-register',
  standalone: true,
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    DialogLayoutComponent,
    LabelComponent,
    PasswordComponent,
    AlertComponent,
    LoadingDirective,
    GoogleSigninButtonModule,
  ],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public readonly signIn = output();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);

  /** Whether form is loading. */
  protected readonly isLoading = signal(false);

  /** Register form. */
  protected readonly registerForm: FormGroup<RegisterFormData>;

  public constructor() {
    this.registerForm = this.initRegisterForm();
  }

  protected onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    this.authApiService
      .login(this.registerForm.getRawValue())
      .pipe(
        toggleExecutionState(this.isLoading.set.bind(this)),
        catchValidationData(this.registerForm),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onNavigateToSignIn(): void {
    this.signIn.emit();
  }

  private initRegisterForm(): FormGroup<RegisterFormData> {
    return this.fb.group<RegisterFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
      confirmPassword: this.fb.control('', Validators.required),
      pictureUrl: this.fb.control(null),
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
    });
  }
}

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
import { RegisterData, registerDataSchema } from '@knb/core/models/register-data';
import { UserService } from '@knb/core/services/ui-services/user.service';
import {
  catchValidationData
} from '@knb/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { AppValidators } from '@knb/core/utils/validators';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { DialogLayoutComponent } from '@knb/shared/layouts/dialog-layout/dialog-layout.component';
import { AlertComponent } from '../../alert/alert.component';
import { PasswordComponent } from '../../inputs/password/password.component';
import { LabelComponent } from '../../label/label.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationDialogComponent } from '../authentication-dialog.component';
import { tap } from 'rxjs';

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
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
	private readonly dialogRef = inject(MatDialogRef<AuthenticationDialogComponent>);

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

    const registerFormValue = registerDataSchema.parse(this.registerForm.getRawValue())

    this.userService
      .register(registerFormValue)
      .pipe(
        toggleExecutionState(this.isLoading.set.bind(this)),
        tap(() => this.dialogRef.close()),
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
      confirmPassword: this.fb.control('', [AppValidators.matchControl("password", "Password"), Validators.required]),
      pictureUrl: this.fb.control(null),
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
    });
  }
}

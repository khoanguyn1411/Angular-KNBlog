import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RegisterData, registerDataSchema } from '@knb/core/models/register-data';
import { SnackbarService } from '@knb/core/services/ui-services/snackbar.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { catchValidationData } from '@knb/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { AppValidators } from '@knb/core/utils/validators';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { DialogLayoutComponent } from '@knb/shared/layouts/dialog-layout/dialog-layout.component';
import { MonoTypeOperatorFunction, tap } from 'rxjs';
import { AlertComponent } from '../../alert/alert.component';
import { PasswordComponent } from '../../inputs/password/password.component';
import { LabelComponent } from '../../label/label.component';
import { ResizedGoogleButtonComponent } from '../../resized-google-button/resized-google-button.component';
import { AuthenticationDialogComponent } from '../authentication-dialog.component';

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
    ResizedGoogleButtonComponent,
  ],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public readonly signIn = output();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<AuthenticationDialogComponent>);
  private readonly snackbarService = inject(SnackbarService);

  /** Whether form is loading. */
  protected readonly isLoading = signal(false);

  /** Register form. */
  protected readonly registerForm: FormGroup<RegisterFormData>;

  public constructor() {
    this.registerForm = this.initRegisterForm();
  }

  public ngOnInit(): void {
    this.userService
      .loginWithGoogleFromAuthState()
      .pipe(this.handleSignupSuccessfully('Sign in successful.'), takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    const registerFormValue = registerDataSchema.parse(this.registerForm.getRawValue());

    this.userService
      .register(registerFormValue)
      .pipe(
        toggleExecutionState(this.isLoading),
        this.handleSignupSuccessfully('Sign up successfully.'),
        catchValidationData(this.registerForm),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected onNavigateToSignIn(): void {
    this.signIn.emit();
  }

  private handleSignupSuccessfully<T>(message: string): MonoTypeOperatorFunction<T> {
    return (source$) =>
      source$.pipe(
        tap(() => {
          this.dialogRef.close();
          this.snackbarService.notify({
            type: 'success',
            text: message,
          });
        }),
      );
  }

  private initRegisterForm(): FormGroup<RegisterFormData> {
    return this.fb.group<RegisterFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
      confirmPassword: this.fb.control('', [AppValidators.matchControl('password', 'Password'), Validators.required]),
      pictureUrl: this.fb.control(null),
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
    });
  }
}

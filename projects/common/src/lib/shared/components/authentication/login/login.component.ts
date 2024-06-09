import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { LoginData, loginDataSchema } from '@knb/core/models/login-data';
import { SnackbarService } from '@knb/core/services/ui-services/snackbar.service';
import { UserService } from '@knb/core/services/ui-services/user.service';
import { catchValidationData, catchValidationError } from '@knb/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@knb/core/utils/types/controls-of';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LoadingDirective } from '@knb/shared/directives/loading.directive';
import { DialogLayoutComponent } from '@knb/shared/layouts/dialog-layout/dialog-layout.component';
import { MonoTypeOperatorFunction, Observable, map, merge, tap, throwError } from 'rxjs';
import { AlertComponent } from '../../alert/alert.component';
import { PasswordComponent } from '../../inputs/password/password.component';
import { LabelComponent } from '../../label/label.component';
import { ResizedGoogleButtonComponent } from '../../resized-google-button/resized-google-button.component';
import { AuthenticationDialogComponent } from '../authentication-dialog.component';

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
    AlertComponent,
    LoadingDirective,
    ResizedGoogleButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public readonly signup = output();

  private readonly dialogRef = inject(MatDialogRef<AuthenticationDialogComponent>);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(SnackbarService);

  /** Authentication error. */
  protected readonly authenticationError = signal<null | string>(null);

  /** Whether form is loading. */
  protected readonly isLoading = signal(false);

  /** Login form. */
  protected readonly loginForm: FormGroup<LoginFormData>;

  public constructor() {
    this.loginForm = this.initLoginForm();
  }

  public ngOnInit(): void {
    merge(
      this.resetAuthenticationErrorSideEffect(),
      this.userService.loginWithGoogleFromAuthState().pipe(this.handleLoginSuccessfully()),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    const loginFormValue = loginDataSchema.parse(this.loginForm.getRawValue());

    this.userService
      .login(loginFormValue)
      .pipe(
        toggleExecutionState(this.isLoading.set.bind(this)),
        this.handleLoginSuccessfully(),
        catchValidationError((error) => {
          this.authenticationError.set(error.validationData.nonFieldErrors ?? null);
          return throwError(() => error);
        }),
        catchValidationData(this.loginForm),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected onNavigateToSignup(): void {
    this.signup.emit();
  }

  private handleLoginSuccessfully<T>(): MonoTypeOperatorFunction<T> {
    return (source$) =>
      source$.pipe(
        tap(() => {
          this.dialogRef.close();
          this.snackbarService.notify({
            type: 'success',
            text: 'Sign in successfully.',
          });
        }),
      );
  }

  private resetAuthenticationErrorSideEffect(): Observable<void> {
    return this.loginForm.valueChanges.pipe(
      tap(() => this.authenticationError.set(null)),
      map(() => undefined),
    );
  }

  private initLoginForm(): FormGroup<LoginFormData> {
    return this.fb.group<LoginFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
    });
  }
}

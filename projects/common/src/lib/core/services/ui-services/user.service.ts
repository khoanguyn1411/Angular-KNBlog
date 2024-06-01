import { SocialAuthService } from '@abacritt/angularx-social-login';
import { inject, Injectable } from '@angular/core';
import { AppError } from '@knb/core/models/app-error';
import { GoogleAuthData } from '@knb/core/models/google-auth-data';
import { LoginData } from '@knb/core/models/login-data';
import { RegisterData } from '@knb/core/models/register-data';
import { User } from '@knb/core/models/user';
import { UserSecret } from '@knb/core/models/user-secret';
import { catchHttpErrorResponse } from '@knb/core/utils/rxjs/catch-http-error-response';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import {
  catchError,
  concat,
  first,
  ignoreElements,
  map,
  merge,
  Observable,
  of,
  OperatorFunction,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthApiService } from '../api-services/auth-api.service';
import { UserApiService } from '../api-services/user-api.service';
import { SnackbarService } from './snackbar.service';
import { UserSecretStorageService } from './user-secret-storage.service';

/**
 * Stateful service for storing/managing information about the current user.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** Current user. `null` when a user is not logged in. */
  public readonly currentUser$: Observable<User | null>;

  /** Whether the current user is authorized. */
  public readonly isAuthorized$: Observable<boolean>;

  private readonly authService = inject(AuthApiService);
  private readonly userSecretStorage = inject(UserSecretStorageService);
  private readonly userApiService = inject(UserApiService);
  private readonly socialAuthService = inject(SocialAuthService);
  private readonly snackbarService = inject(SnackbarService);

  public constructor() {
    this.currentUser$ = this.initCurrentUserStream();
    this.isAuthorized$ = this.currentUser$.pipe(map((user) => user != null));
  }

  /**
   * Login a user with email and password.
   * @param loginData Login data.
   */
  public login(loginData: LoginData): Observable<void> {
    return this.authService
      .login(loginData)
      .pipe(this.saveSecretAndWaitForAuthorized());
  }

   /**
   * Login or register a user with Google.
   * @param data Login data.
   */
   public loginWithGoogle(data: GoogleAuthData): Observable<void> {
    return this.authService
      .loginWithGoogle(data)
      .pipe(this.saveSecretAndWaitForAuthorized());
  }

  public loginWithGoogleFromAuthState(): Observable<void> {
    return this.socialAuthService.authState.pipe(
      filterNull(),
      switchMap((user) => {
        return this.loginWithGoogle({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          pictureUrl: user.photoUrl,
          googleTokenId: user.idToken,
        });
      }),
      catchHttpErrorResponse((error) => {
        this.snackbarService.notify({ type: 'error', text: error.message });
        return throwError(() => error);
      })
    );
  }


  /**
   * Register a user.
   * @param registerData Register data.
   */
  public register(registerData: RegisterData): Observable<void> {
    return this.authService
      .register(registerData)
      .pipe(this.saveSecretAndWaitForAuthorized());
  }

  /** Attempts to refresh user secret, in case it is not possible logs out current user.. */
  public refreshSecret(): Observable<void> {
    const refreshSecretIfPresent$ = this.userSecretStorage.currentSecret$.pipe(
      first(),
      switchMap((secret) => {
        if (secret != null) {
          return this.authService.refreshSecret(secret);
        }
        throw new AppError('Unauthorized');
      }),
      switchMap((newSecret) => this.userSecretStorage.saveSecret(newSecret))
    );
    return refreshSecretIfPresent$.pipe(
      catchError((error: unknown) =>
        concat(
          this.authService.logout().pipe(ignoreElements()),
          throwError(() => error)
        )
      ),
      map(() => undefined)
    );
  }

  /** Logout current user. */
  public logout(): Observable<void> {
    const logoutSideEffects$ = merge(this.userSecretStorage.removeSecret());

    return this.authService.logout().pipe(
      switchMap(() => logoutSideEffects$),
      catchError(() => logoutSideEffects$)
    );
  }

  private saveSecretAndWaitForAuthorized(): OperatorFunction<UserSecret, void> {
    return (source$) =>
      source$.pipe(
        switchMap((secret) => {
          const saveUserSecretSideEffect$ = this.userSecretStorage
            .saveSecret(secret)
            .pipe(ignoreElements());

          return merge(this.isAuthorized$, saveUserSecretSideEffect$);
        }),
        first((isAuthorized) => isAuthorized),
        map(() => undefined)
      );
  }

  private initCurrentUserStream(): Observable<User | null> {
    return this.userSecretStorage.currentSecret$.pipe(
      switchMap((secret) =>
        secret ? this.userApiService.getCurrentUser() : of(null)
      ),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
}

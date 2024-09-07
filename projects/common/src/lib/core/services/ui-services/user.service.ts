import { SocialAuthService } from '@abacritt/angularx-social-login';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppError } from '@knb/core/models/app-error';
import { GoogleAuthData } from '@knb/core/models/google-auth-data';
import { LoginData } from '@knb/core/models/login-data';
import { RegisterData } from '@knb/core/models/register-data';
import { User } from '@knb/core/models/user';
import { UserSecret } from '@knb/core/models/user-secret';
import { catchHttpErrorResponse } from '@knb/core/utils/rxjs/catch-http-error-response';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import {
  BehaviorSubject,
  catchError,
  combineLatestWith,
  concat,
  first,
  from,
  ignoreElements,
  map,
  merge,
  Observable,
  of,
  OperatorFunction,
  shareReplay,
  switchMap,
  tap,
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
  private readonly authService = inject(AuthApiService);
  private readonly userSecretStorage = inject(UserSecretStorageService);
  private readonly userApiService = inject(UserApiService);
  private readonly socialAuthService = inject(SocialAuthService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly routePaths = injectWebAppRoutes();

  private readonly refreshProfileIndicator$ = new BehaviorSubject({});
  private readonly isUserFetchingSignal = signal(true);

  /** Current user. `null` when a user is not logged in. */
  public readonly currentUser$: Observable<User | null>;

  /** Whether the current user is authorized. */
  public readonly isAuthorized$: Observable<boolean>;

  public constructor() {
    this.currentUser$ = this.initCurrentUserStream();
    this.isAuthorized$ = this.currentUser$.pipe(map((user) => user != null));
  }

  /** Whether current user is fetching. */
  public isUserFetching = computed(() => this.isUserFetchingSignal());

  /**
   * Require authorized to perform action.
   * @param callback Callback to perform.
   */
  public requireAuthorizedToPerformAction(callback: () => void): void {
    this.isAuthorized$
      .pipe(
        first(),
        tap((isAuthorized) => {
          if (isAuthorized) {
            callback();
            return;
          }
          this.snackbarService.notify({ type: 'error', text: 'You have to login to perform this action.' });
        }),
      )
      .subscribe();
  }

  /**
   * Login a user with email and password.
   * @param loginData Login data.
   */
  public login(loginData: LoginData): Observable<void> {
    return this.authService.login(loginData).pipe(this.saveSecretAndWaitForAuthorized());
  }

  /**
   * Login or register a user with Google.
   * @param data Login data.
   */
  public loginWithGoogle(data: GoogleAuthData): Observable<void> {
    return this.authService.loginWithGoogle(data).pipe(this.saveSecretAndWaitForAuthorized());
  }

  /** Refresh user profile. */
  public refreshUserProfile() {
    this.refreshProfileIndicator$.next({});
  }

  /** Login with google from auth state. */
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
      }),
    );
  }

  /**
   * Register a user.
   * @param registerData Register data.
   */
  public register(registerData: RegisterData): Observable<void> {
    return this.authService.register(registerData).pipe(this.saveSecretAndWaitForAuthorized());
  }

  /** Attempts to refresh user secret, in case it is not possible logs out current user. */
  public refreshSecret(): Observable<void> {
    const refreshSecretIfPresent$ = this.userSecretStorage.currentSecret$.pipe(
      first(),
      switchMap((secret) => {
        if (secret != null) {
          return this.authService.refreshSecret(secret);
        }
        throw new AppError('Invalid User Token');
      }),
      switchMap((newSecret) => this.userSecretStorage.saveSecret(newSecret)),
    );
    return refreshSecretIfPresent$.pipe(
      catchError((error: unknown) =>
        concat(
          this.logout().pipe(ignoreElements()),
          throwError(() => error),
        ),
      ),
      map(() => undefined),
    );
  }

  /** Logout current user. */
  public logout(): Observable<void> {
    const googleLogoutEffect$ = from(this.socialAuthService.signOut());
    const removeSecretEffect$ = this.userSecretStorage.removeSecret();
    const navigateToHomepageEffect$ = from(this.router.navigateByUrl(this.routePaths.root.url)).pipe(
      map(() => undefined),
    );
    const logoutSideEffects$ = merge(removeSecretEffect$, googleLogoutEffect$, navigateToHomepageEffect$);

    return this.currentUser$.pipe(
      switchMap((user) => (user != null ? this.authService.logout() : of(null))),
      switchMap(() => logoutSideEffects$),
      catchError(() => logoutSideEffects$),
    );
  }

  private saveSecretAndWaitForAuthorized(): OperatorFunction<UserSecret, void> {
    return (source$) =>
      source$.pipe(
        switchMap((secret) => {
          const saveUserSecretSideEffect$ = this.userSecretStorage.saveSecret(secret).pipe(ignoreElements());

          return merge(this.isAuthorized$, saveUserSecretSideEffect$);
        }),
        first((isAuthorized) => isAuthorized),
        map(() => undefined),
      );
  }

  private initCurrentUserStream(): Observable<User | null> {
    return this.userSecretStorage.currentSecret$.pipe(
      combineLatestWith(this.refreshProfileIndicator$),
      switchMap(([secret]) =>
        secret
          ? this.userApiService.getCurrentUser().pipe(toggleExecutionState(this.isUserFetchingSignal))
          : of(null).pipe(tap(() => this.isUserFetchingSignal.set(false))),
      ),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { userSecretDtoSchema } from '@knb/core/dtos/user-secret.dto';
import { AppErrorMapper } from '@knb/core/mapper/app-error.mapper';
import { LoginDataMapper } from '@knb/core/mapper/login-data.mapper';
import { UserSecretMapper } from '@knb/core/mapper/user-secret.mapper';
import { LoginData } from '@knb/core/models/login-data';
import { UserSecret } from '@knb/core/models/user-secret';
import { Observable, map } from 'rxjs';
import { RegisterDataMapper } from '@knb/core/mapper/register-data.mapper';
import { RegisterData } from '@knb/core/models/register-data';
import { GoogleAuthDataMapper } from '@knb/core/mapper/google-auth-data.mapper';
import { GoogleAuthData } from '@knb/core/models/google-auth-data';
import { AppUrlsConfig } from './app-urls.config';

/**
 * Performs CRUD operations for auth-related information.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrlsConfig = inject(AppUrlsConfig);

  private readonly loginDataMapper = inject(LoginDataMapper);

  private readonly registerDataMapper = inject(RegisterDataMapper);

  private readonly appErrorMapper = inject(AppErrorMapper);

  private readonly userSecretMapper = inject(UserSecretMapper);

  private readonly googleAuthDataMapper = inject(GoogleAuthDataMapper);

  /**
   * Login a user with email and password.
   * @param loginData Login data.
   */
  public login(loginData: LoginData): Observable<UserSecret> {
    return this.httpClient
      .post<unknown>(
        this.apiUrlsConfig.auth.login,
        this.loginDataMapper.toDto(loginData),
      )
      .pipe(
        map((response) => userSecretDtoSchema.parse(response)),
        map((secretDto) => this.userSecretMapper.fromDto(secretDto)),
        this.appErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(
          this.loginDataMapper,
        ),
      );
  }

  /**
   * Register user.
   * @param registerData Register data.
   */
  public register(registerData: RegisterData): Observable<UserSecret> {
    return this.httpClient
      .post<unknown>(
        this.apiUrlsConfig.auth.register,
        this.registerDataMapper.toDto(registerData),
      )
      .pipe(
        map((response) => userSecretDtoSchema.parse(response)),
        map((secretDto) => this.userSecretMapper.fromDto(secretDto)),
        this.appErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(
          this.registerDataMapper,
        ),
      );
  }

  /**
   * Register or login user by Google.
   * @param googleAuthData Google auth data.
   */
  public loginWithGoogle(
    googleAuthData: GoogleAuthData,
  ): Observable<UserSecret> {
    return this.httpClient
      .post<unknown>(
        this.apiUrlsConfig.auth.googleLogin,
        this.googleAuthDataMapper.toDto(googleAuthData),
      )
      .pipe(
        map((response) => userSecretDtoSchema.parse(response)),
        map((secretDto) => this.userSecretMapper.fromDto(secretDto)),
      );
  }

  /**
   * Refresh user's secret.
   * @param secret Secret data.
   */
  public refreshSecret(secret: UserSecret): Observable<UserSecret> {
    return this.httpClient
      .post<unknown>(
        this.apiUrlsConfig.auth.refreshSecret,
        this.userSecretMapper.toDto(secret),
      )
      .pipe(
        map((response) => userSecretDtoSchema.parse(response)),
        map((secretDto) => this.userSecretMapper.fromDto(secretDto)),
        this.appErrorMapper.catchHttpErrorToAppError(),
      );
  }

  /** Logout current user. */
  public logout(): Observable<void> {
    return this.httpClient
      .post<void>(this.apiUrlsConfig.auth.logout, {})
      .pipe(this.appErrorMapper.catchHttpErrorToAppError());
  }
}

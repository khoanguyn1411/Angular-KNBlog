import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { UserSecret } from '../models/user-secret';
import { UserSecretStorageService } from '../services/api-services/user-secret-storage.service';
import { AppConfig } from '../services/app.config';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Token';

/** Adds JWT to requests using Authorization HTTP header. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly appConfigService = inject(AppConfig);

  private readonly userSecretStorage = inject(UserSecretStorageService);

  /** @inheritdoc */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.shouldInterceptToken(req.url)) {
      const userSecret$ = this.userSecretStorage.currentSecret$.pipe(first());
      return userSecret$.pipe(
        tap((s) => console.log({ s })),
        map((userSecret) =>
          userSecret
            ? req.clone({
                headers: this.appendAuthorizationHeader(
                  req.headers,
                  userSecret
                ),
              })
            : req
        ),
        switchMap((newReq) => next.handle(newReq))
      );
    }

    // Do nothing.
    return next.handle(req);
  }

  /**
   * Checks if a request is for authorization or refresh token.
   * @param url - Request url.
   */
  private shouldInterceptToken(url: string): boolean {
    return url.startsWith(this.appConfigService.apiUrl);
  }

  /**
   * Appends authorization header to a list of `headers`.
   * @param headers Headers list.
   * @param userSecret User secret.
   */
  private appendAuthorizationHeader(
    headers: HttpHeaders,
    userSecret: UserSecret
  ): HttpHeaders {
    return headers.set(
      AUTH_HEADER_KEY,
      `${AUTH_PREFIX} ${userSecret.accessToken}`
    );
  }
}

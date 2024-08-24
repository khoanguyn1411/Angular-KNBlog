import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { injectWebAppRoutes } from 'projects/web/src/shared/web-route-paths';
import { map } from 'rxjs';
import { UserService } from '../services/ui-services/user.service';

type AuthGuardParams = {
  /**
   * Whether guard is configured for currently authorized user or not.
   * If 'true', guard will prevent a current user from accessing a route if he is not authorized.
   * If 'false', guard will prevent a current user from accessing a route if he is authorized.
   */
  readonly isAuthorized: boolean;
};

/**
 * Auth guard.
 * @param {AuthGuardParams} params Params.
 * @param params.isAuthorized Whether guard is configured for currently authorized user or not.
 */
export function authGuard({ isAuthorized }: AuthGuardParams): CanMatchFn {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);
    const routePath = injectWebAppRoutes();

    return userService.isAuthorized$.pipe(
      map((isUserAuthorized) => {
        if (isAuthorized) {
          return isUserAuthorized ? true : router.parseUrl(routePath.root.path);
        }

        return isUserAuthorized ? router.parseUrl(routePath.root.path) : true;
      }),
    );
  };
}

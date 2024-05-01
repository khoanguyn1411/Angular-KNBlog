import { inject, InjectionToken, Provider } from '@angular/core';
import { buildRoutePaths } from '@knb/core/utils/route-paths/build-route-paths';
import { baseRoutePaths } from '@knb/core/utils/route-paths/route-paths';

/** Job id param. */
export const JOB_ID_PARAM = 'jobId';

/** Injection token that provide object with route web app paths. */
const WEB_ROUTE_PATHS_TOKEN = new InjectionToken<WebRoutePaths>('Provide object with web route paths');

const authRoutePaths = buildRoutePaths({
  auth: {
    path: 'auth',
    children: {
      login: { path: 'login' },
      register: { path: 'register' },
    },
  },
} as const);

const homeRoutePaths = buildRoutePaths({
  root: { path: 'home' },
} as const);


/**
 * Web route paths object.
 * It's intended to be used only in Routing modules.
 * So don't import this object directly into components.
 * Prefer to use `injectWebAppRoutes` instead.
 * It's necessary to make our component more flexible for unit tests.
 * @example
 * ```ts
 * const routes: Routes = [
 *   { path: webRoutePaths.home, component: HomePageComponent },
 *   // ...
 * ];
 * ```
 */
export const webRoutePaths = buildRoutePaths({
	...baseRoutePaths,
  ...authRoutePaths,
  ...homeRoutePaths
} as const);

type WebRoutePaths = typeof webRoutePaths;

/** Create provider for a web route paths. */
export function provideWebAppRoutes(): Provider {
	return {
		provide: WEB_ROUTE_PATHS_TOKEN,
		useValue: webRoutePaths,
	};
}

/**
 * Inject web app route paths to component.
 * Warning: Method should be called in the constructor phase to avoid runtime error because of `inject()`.
 * @example
 * ```ts
 * class SomeComponent {
 *   // ...
 *   protected readonly routePaths = injectWebAppRoutes();
 *   public constructor() { };
 * }
 * ```
 */
export function injectWebAppRoutes(): WebRoutePaths {
	return inject(WEB_ROUTE_PATHS_TOKEN);
}

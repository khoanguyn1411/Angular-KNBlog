import { buildNavigateUrl } from './build-navigate-url';

/**
 * Represents root route paths configuration.
 * @example
 * ```ts
 * const authRoutes: RoutePathsConfig = {
 *   auth: {
 *     path: 'auth',
 *     children: {
 *       login: {
 *         path: 'login',
 *       },
 *     },
 *   },
 * } as const;
 * ```
 */
type RoutePathsConfig = Readonly<Record<string, RoutePathOptions>>;

/** Route path options. */
interface RoutePathOptions {
  /** Path. */
  readonly path: string;

  /** Children routes config. */
  readonly children?: RoutePathsConfig;
}

/** Route path. */
interface RoutePath {
  /** Path used in routing modules. */
  readonly path: string;

  /** Navigation url used for navigation in components. */
  readonly url: string;
}

/** Route path with children. */
interface RoutePathWithChildren<T extends RoutePathsConfig> extends RoutePath {
  /** Children routes. */
  readonly children: RoutePaths<T>;
}

/** Dynamic route path. */
interface DynamicRoutePath<P extends Record<string, string | number>> {
  /** Path. */
  readonly path: string;

  /** Dynamic navigation url. */
  readonly url: (param: P) => string;
}

/** Dynamic route path. */
interface DynamicRoutePathWithChildren<T extends RoutePathsConfig, P extends Record<string, string | number>>
  extends DynamicRoutePath<P> {
  /** Dynamic children routes. */
  readonly children: (params: P) => RoutePaths<T>;
}

/**
 * Represents a type that infers an interface for paths which contain dynamic route params.
 * @example
 * ```ts
 * const userEditPath = 'users/:id/edit';
 * type UserPathParams = PathParams<typeof userEditPath>;
 * // type UserPathParams = { id: string | number; }
 * ```
 */
type PathParams<T extends string> = T extends `${infer _}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof PathParams<Rest>]: string | number }
  : T extends `${infer _}:${infer Param}`
    ? { [K in Param]: string | number }
    : unknown;

type RoutePaths<T extends RoutePathsConfig> = {
  [K in keyof T]: T[K]['children'] extends RoutePathsConfig
    ? PathParams<T[K]['path']> extends Record<string, string | number>
      ? DynamicRoutePathWithChildren<T[K]['children'], PathParams<T[K]['path']>>
      : RoutePathWithChildren<T[K]['children']>
    : PathParams<T[K]['path']> extends Record<string, string | number>
      ? DynamicRoutePath<PathParams<T[K]['path']>>
      : RoutePath;
};

/**
 * Build route paths object from config.
 * Warning: Make sure every route is declared as const, so that the string types would be exact.
 * @example
 * ```ts
 * buildRoutePaths({
 *   auth: {
 *     path: 'auth',
 *     children: {
 *       login: { path: 'login' },
 *     },
 *   },
 * } as const);
 * ```
 * @param config Route paths config.
 * @param parentPath Parent route path.
 */
export function buildRoutePaths<T extends RoutePathsConfig>(config: T, parentPath = '/'): RoutePaths<typeof config> {
  const result = Object.keys(config).reduce(
    (acc, key: keyof T) => {
      const value = config[key];

      const paramFromPath = value.path.match(/:(\w+)/g);
      if (paramFromPath?.length) {
        return {
          ...acc,
          [key]: {
            path: value.path,
            url: (params: Record<string, string | number>) => `${parentPath}${buildNavigateUrl(value.path, params)}`,
            children: (params: Record<string, string | number>) =>
              value.children
                ? buildRoutePaths(value.children, `${parentPath}${buildNavigateUrl(value.path, params)}/`)
                : undefined,
          },
        };
      }

      const fullPath = parentPath + value.path;
      if (!value.children) {
        return {
          ...acc,
          [key]: {
            path: value.path,
            url: fullPath,
          },
        };
      }

      return {
        ...acc,
        [key]: {
          path: value.path,
          url: fullPath,
          children: buildRoutePaths(value.children, `${fullPath}/`),
        },
      };
    },
    {} as RoutePaths<typeof config>,
  );
  return result;
}

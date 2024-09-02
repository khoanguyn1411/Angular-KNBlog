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
type RoutePathOptions = {
  /** Path. */
  readonly path: string;

  /** Children routes config. */
  readonly children?: RoutePathsConfig;
};

/** Route path. */
type RoutePath = {
  /** Path used in routing modules. */
  readonly path: string;

  /** Navigation url used for navigation in components. */
  readonly url: string;
};

/** Route path with children. */
type RoutePathWithChildren<T extends RoutePathsConfig> = RoutePath & {
  /** Children routes. */
  readonly children: RoutePaths<T>;
};

/** Dynamic route path. */
type DynamicRoutePath<P extends Record<string, string | number>> = {
  /** Path. */
  readonly path: string;

  /** Dynamic navigation url. */
  readonly url: (param: P) => string;
};

/** Dynamic route path. */
type DynamicRoutePathWithChildren<
  T extends RoutePathsConfig,
  P extends Record<string, string | number>,
> = DynamicRoutePath<P> & {
  /** Dynamic children routes. */
  readonly children: (params: P) => RoutePaths<T>;
};

/**
 * Represents a type that infers a type for paths which contain dynamic route params.
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
      const routeOptions = config[key];

      if (hasParams(routeOptions.path)) {
        return {
          ...acc,
          [key]: buildRoutePathWithParams(routeOptions, parentPath),
        };
      }

      if (routeOptions.children == null) {
        return {
          ...acc,
          [key]: buildRoutePath(routeOptions, parentPath),
        };
      }

      return {
        ...acc,
        [key]: buildRoutePathWithChildren(routeOptions, parentPath),
      };
    },
    {} as RoutePaths<typeof config>,
  );
  return result;
}

/**
 * Build an url with a path and its parameters.
 * @example
 * ```ts
 * const userProjectEditUrl = buildNavigateUrl(
 *   'users/:userId/projects/:projectId/edit',
 *   { userId: 10, projectId: '1' },
 * );
 * // userProjectEditUrl = 'users/10/projects/1/edit'
 * ```
 * @param path Target path.
 * @param params Parameters.
 */
function buildNavigateUrl<P extends string>(path: P, params: Record<string, string | number>): string {
  return Object.keys(params).reduce((acc, key) => acc.replace(`:${key}`, params[key].toString()), path);
}

/**
 * Whether path has params or not.
 * @param path Path.
 */
function hasParams(path: string): boolean {
  const params = path.match(/:(\w+)/g);
  return Boolean(params?.length);
}

/**
 * Build route path with params.
 * @param routeOptions Route options.
 * @param parentPath Parent path.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function buildRoutePathWithParams<T extends RoutePathsConfig>(routeOptions: T[keyof T], parentPath: string) {
  return {
    path: routeOptions.path,
    url: (params: Record<string, string | number>) => `${parentPath}${buildNavigateUrl(routeOptions.path, params)}`,
    children: (params: Record<string, string | number>) =>
      routeOptions.children
        ? buildRoutePaths(routeOptions.children, `${parentPath}${buildNavigateUrl(routeOptions.path, params)}/`)
        : undefined,
  };
}

/**
 * Build simple route path.
 * @param routeOptions Route options.
 * @param parentPath Parent path.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function buildRoutePath<T extends RoutePathsConfig>(routeOptions: T[keyof T], parentPath: string) {
  return {
    path: routeOptions.path,
    url: parentPath + routeOptions.path,
  };
}

/**
 * Build route path with children.
 * @param routeOptions Route options.
 * @param parentPath Parent path.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function buildRoutePathWithChildren<T extends RoutePathsConfig>(routeOptions: T[keyof T], parentPath: string) {
  const fullPath = parentPath + routeOptions.path;

  return {
    path: routeOptions.path,
    url: fullPath,
    children: routeOptions.children ? buildRoutePaths(routeOptions.children, `${fullPath}/`) : undefined,
  };
}

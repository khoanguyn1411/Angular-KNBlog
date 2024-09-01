/**
 * Object type.
 * The main benefit of Record<string, any> is idexable types, compare with pure `object` type.
 */

import { StrictOmit } from '../types/strict-omit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordObject = Record<string, any>;

/** Check if type is include provided key or not. */
type IsInclude<T extends RecordObject, P extends string> = T[P] extends string ? true : false;

export type ExtractPageKey<T extends RoutePaths<RecordObject>> =
  | keyof T
  | keyof {
      [Key in keyof T as T[Key] extends {
        children: RecordObject;
      }
        ? // Using `Extract` type to transfer keyof T to string type for usage of Template Literal Types.
          `${Extract<Key, string>}.${Extract<ExtractPageKey<T[Key]['children']>, string>}`
        : never]: never;
    };

/** Config types. */
interface RoutePathBaseOptions {
  readonly path: string;
  readonly children?: RoutePathsConfig;
}
interface RoutePathOptions extends RoutePathBaseOptions {
  readonly title?: string;
}

type RoutePathsConfig = Record<string, RoutePathOptions>;

/** Returned types. */
interface RoutePathBaseReturned {
  readonly path: string;
  readonly url: string;
  readonly title?: string;
}

type RoutePathWithChildren<T extends RoutePathsConfig, HasTitle extends boolean> = {
  readonly children: RoutePaths<T>;
} & ShouldReturnRoutePathBaseWithTitle<HasTitle>;

type ShouldReturnRoutePathBaseWithTitle<T extends boolean> = T extends false
  ? StrictOmit<RoutePathBaseReturned, 'title'>
  : Required<RoutePathBaseReturned>;

type NormalRoute<InputConfig extends RoutePathBaseOptions> = InputConfig['children'] extends RoutePathsConfig
  ? IsInclude<InputConfig, 'title'> extends true
    ? RoutePathWithChildren<InputConfig['children'], true>
    : RoutePathWithChildren<InputConfig['children'], false>
  : IsInclude<InputConfig, 'title'> extends true
    ? Required<RoutePathBaseReturned>
    : StrictOmit<RoutePathBaseReturned, 'title'>;

type FunctionalChildren<InputConfig extends RoutePathBaseOptions, Start extends string> = (
  param: Record<Start, string>,
) => InputConfig['children'] extends RoutePathsConfig
  ? RoutePaths<InputConfig['children']>
  : ShouldReturnRoutePathBaseWithTitle<false>;

interface DynamicUrlWithChildren<InputConfig extends RoutePathBaseOptions, Param extends string>
  extends DynamicUrl<Param> {
  readonly children: FunctionalChildren<InputConfig, Param>;
}

type DynamicRouteParam<
  InputConfig extends RoutePathBaseOptions,
  Param extends string,
> = InputConfig['children'] extends RoutePathsConfig ? DynamicUrlWithChildren<InputConfig, Param> : DynamicUrl<Param>;

interface DynamicUrl<Param extends string> {
  readonly dynamicUrl: (param: Record<Param, string>) => string;
}

type DynamicRoute<InputConfig extends RoutePathBaseOptions, Param extends string> = StrictOmit<
  RoutePathBaseReturned,
  'title'
> &
  DynamicRouteParam<InputConfig, Param>;

type ExtractToRoutePathOption<T extends RoutePathBaseOptions> = Extract<T, RoutePathBaseOptions>;

type RoutePaths<InputConfig extends RoutePathsConfig> = {
  [Key in keyof InputConfig]: InputConfig[Key]['path'] extends `:${infer Param}`
    ? DynamicRoute<ExtractToRoutePathOption<InputConfig[Key]>, Param>
    : NormalRoute<ExtractToRoutePathOption<InputConfig[Key]>>;
};

/**
 * Check if entity is RoutePathOptions or not.
 * @param entity Entity need to be checked.
 */
function isRoutePathsRootConfig(entity: RoutePathBaseOptions): entity is RoutePathOptions {
  return !!(entity as RoutePathOptions).title;
}

/**
 * Build route object from config.
 * - Provide config for new route paths, then cast it with `as const` to provide
 * readonly and literal string type for config object.
 * - For config object, it is required to provide `path` for route key.
 * `children` and `title` are optional.
 * @example
    const configRoutePaths = buildRoutePaths({
      config: {
        path: "config",
        title: "Trang cấu hình",
        children: {
          tab: { path: ":tab" },
          rolePermission: { path: "role-permission", title: "Phân quyền" },
        },
      },
    } as const);
 * @param config Route paths config.
 * @param parentRouteUrl Parent route path (first route of path).
 * @returns Routes path object with url and type validation support.
 * - Get Config route path (config): `configRoutePaths.path`
 * - Get Config route url (config): `configRoutePaths.url`
 * - Get RolePermission route url (config/role-permission): `configRoutePaths.children.rolePermission.url`
 * - Navigate with dynamic route (config/[tab]): `configRoutePaths.children.tab.dynamicUrl({tab: "someId"})`
 * - Get url of route after dynamic route (config/[tab]/otherPath): `configRoutePaths.children.tab.children({tab: "someID"}).otherPath.url`
 */
export function buildRoutePaths<T extends RoutePathsConfig>(config: T, parentRouteUrl = '/'): RoutePaths<T> {
  return Object.keys(config).reduce((acc, key: keyof T) => {
    const value = config[key];
    const fullUrl = `${parentRouteUrl}${value.path}`;
    const paramFromPath = value.path.match(/:(\w+)/g);
    if (paramFromPath?.length) {
      return {
        ...acc,
        [key]: {
          title: isRoutePathsRootConfig(value) ? value.title : undefined,
          path: value.path,
          url: fullUrl,
          dynamicUrl: (param: Record<string, string>) => `${parentRouteUrl + buildNavigateUrl(value.path, param)}/`,
          children: (param: Record<string, string>) => {
            if (value.children) {
              return buildRoutePaths(value.children, `${parentRouteUrl + buildNavigateUrl(value.path, param)}/`);
            }
            return undefined;
          },
        },
      };
    }
    if (!value.children) {
      return {
        ...acc,
        [key]: {
          title: isRoutePathsRootConfig(value) ? value.title : undefined,
          path: value.path,
          url: fullUrl,
          children: value.children ? buildRoutePaths(value.children, fullUrl) : undefined,
        },
      };
    }
    return {
      ...acc,
      [key]: {
        title: isRoutePathsRootConfig(value) ? value.title : undefined,
        path: value.path,
        url: fullUrl,
        children: value.children ? buildRoutePaths(value.children, `${fullUrl}/`) : undefined,
      },
    };
  }, {} as RoutePaths<T>);
}

/**
 * Build an url with a path and its parameters.
 * @example
 * buildNavigateUrl(
 *   '/a/:first/:last',
 *   { first: 'p', last: 'q' },
 * ) // returns '/a/p/q'
 * @param path Target path.
 * @param params Parameters.
 */
function buildNavigateUrl<P extends string>(path: P, params: Record<string, string>): string {
  return Object.keys(params).reduce((acc, key) => acc.replace(`:${key}`, params[key]), path);
}

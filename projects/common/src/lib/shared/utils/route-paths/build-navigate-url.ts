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
export function buildNavigateUrl<P extends string>(
  path: P,
  params: Record<string, string | number>,
): string {
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(`:${key}`, params[key].toString()),
    path,
  );
}

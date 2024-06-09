/**
 * Type that represents a non-functional enum.
 * Filters out any properties with function types.
 */
export type NonFunctionalEnum<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : T[K];
};

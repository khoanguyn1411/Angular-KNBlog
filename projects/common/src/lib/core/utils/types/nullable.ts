/** Nullable type. */
export type NullableProperties<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] | null;
};

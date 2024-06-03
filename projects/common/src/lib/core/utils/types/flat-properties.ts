/**
 * String object wrapper used here intentionally to correctly work with string enums.
 */
type IsObject<T> = T extends object
  ? T extends unknown[] | readonly unknown[]
    ? never
    : // eslint-disable-next-line @typescript-eslint/ban-types
      T extends Function
      ? never
      : T extends string
        ? never
        : T
  : never;

type ObjectPropertyKeys<T> = keyof {
  [K in keyof T as IsObject<T[K]> extends never ? never : K]: never;
};

/**
 * Flattens a nested object so that all the properties would be in a single layer.
 * Warning: Be careful with recursive type declarations!
 * @example
 * ```ts
 *
 * export interface UserDto {
 *   id: number;
 *   name: string;
 *   phone: string;
 *   email: string;
 * }
 *
 * export interface CarDto {
 *   id: number;
 *   owner: UserDto;
 *   prev_owner?: UserDto;
 *   model: string;
 * }
 *
 * export type CarSortPropertiesDto = FlatProperties<CarDto, '__'>;
 * // type CarSortPropertiesDto = keyof CarDto | "owner__id" | ... | "owner__email" | "prev_owner__id"|  ... | "prev_owner__email"
 * ```
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type FlatProperties<T extends Record<string, any>, S extends string> =
  | keyof T
  | keyof {
      [K in Extract<ObjectPropertyKeys<T>, string> as Record<
        string,
        unknown
      > extends T
        ? never
        : K extends keyof T
          ? `${K}${S}${Extract<FlatProperties<T[K], S>, string>}`
          : never]: never;
    };

/**
 * Parses passed tree and returns all the available paths.
 * @param object Object.
 * @param separator Path segment separator.
 */
export function flattifyProperties<T extends object, TSep extends string>(
  object: T,
  separator: TSep,
): FlatProperties<T, TSep>[] {
  return Object.entries(object).reduce((acc, [key, entry]) => {
    if (entry != null && typeof entry === 'object') {
      return acc.concat(key).concat(
        flattifyProperties(entry, separator)
          .filter(
            (property): property is string => typeof property === 'string',
          )
          .map((property) => `${key}${separator}${property}`),
      );
    }

    return acc.concat(key);
  }, [] as string[]) as FlatProperties<T, TSep>[];
}

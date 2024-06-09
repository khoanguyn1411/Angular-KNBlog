import { NonFunctionalEnum } from './types/non-functional-enum';

/**
 * Constructs a plain enum from an object containing enum-like values.
 * Filters out any functions present in the input object.
 * @param entity The object containing enum-like values.
 * @returns A plain enum object with non-functional properties.
 */
export function constructPlainEnum<T extends Record<string, unknown>>(entity: T): NonFunctionalEnum<T> {
  return Object.fromEntries(
    Object.entries(entity).filter(([_, value]) => typeof value !== 'function'),
  ) as NonFunctionalEnum<T>;
}

import { AppError } from '@knb/core/models/app-error';
import { NonNullableProperties } from '../types/non-nullable-properties';

/**
 * Type-assertion for non-nullable types.
 * @param value Value to assert.
 */
export function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) {
    throw new AppError('Unexpected null.');
  }
}

/**
 * Asserts that value is non nullable, otherwise @throws an `AppError`.
 * @param value Value to assert.
 */
// polyfill for assertion return https://github.com/microsoft/TypeScript/issues/40562
export function assertNonNullWithReturn<T>(value: T | null | undefined): NonNullable<T> {
  assertNonNull(value);
  return value;
}

/**
 * Asserts non-nullable fields in an object.
 * @param object Object to assert non-nullable fields in.
 * @param keys Keys to assert.
 * @example
 * ```ts
 * const teamMemberData: TeamMemberCreationData = assertNonNullFields(
 *   `form.value`, // Partial<TeamMemberCreationData>
 *   'email',
 *   'firstName',
 *   'lastName',
 *   'phoneNumber',
 *   'profession',
 *   'territories',
 * )
 *
 * ```
 */
export function assertNonNullablePropertiesWithReturn<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  ...keys: K[]
): NonNullableProperties<T, K> {
  keys.forEach((key) => assertNonNull(object[key]));
  return object as unknown as NonNullableProperties<T, K>;
}

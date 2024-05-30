/* eslint-disable @typescript-eslint/naming-convention */
import { EntityValidationErrors } from '../models/app-error';

/** Error returned by API. */
export interface ApiError<TDto = unknown> {

  /** Validation data. May not be present in case the error is not related to provided data. */
  readonly data?: ValidationErrorDto<TDto>;

  /** Human-readable description of an error. */
  readonly detail: string;
}

/**
 * Validation error DTO.
 * If a property has primitive type (number, string), then errors - is an array of strings.
 * If a property is an object, then errors is an array of strings if property is null but required e.g.
 * Or is nested ValidationErrorDto<T> object.
 * If a property is an array, then errors is an object where key is name of property
 * and value is array of errors (index in this array corresponds to index of item in the original array).
 */
export type ValidationErrorDto<T> = {
  [P in keyof T]?: T[P] extends (infer K)[]
    ? ValidationErrorDto<K>
    : T[P] extends Record<string, unknown>
      ? ValidationErrorDto<T[P]> | string[]
      : string[];
} & {

  /**
   * Non field errors.
   */
  // eslint-disable-next-line no-restricted-syntax
  readonly nonFieldErrors?: string[];
};

/**
 * Extract errors message from error data.
 * @param errorData Error data.
 * @returns The first item if error data is a array of error messages.
 * Error message from nonFieldErrors if it presented.
 * Error message of the first key if error data is error for composite object like City: { id, name }.
 */
export function extractErrorMessage<T>(
  errorData: ValidationErrorDto<T> |  string[] | null | undefined,
): string | undefined {
  if (errorData == null) {
    return;
  }
  if (Array.isArray(errorData)) {
    return extractErrorMessageFromArray(errorData);
  }
  if (typeof errorData === 'object') {
    // Just get non field error as a result.
    if (errorData.nonFieldErrors != null) {
      return extractErrorMessageFromArray(errorData.nonFieldErrors);
    }

    // Otherwise extract an error from first property.
    const key = Object.keys(errorData)[0] as keyof T;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    return extractErrorMessage(errorData[key] as any);
  }
  return void 0;
}

/**
 * Extract errors messages from error data for entity.
 * @param errorData Error data.
 * @returns The object represents the entity where key is property of entity
 * and value is first error of array of messages for this property.
 */
export function extractEntityErrorMessages<T>(
  errorData: ValidationErrorDto<T>[] | ValidationErrorDto<T> | null | undefined,
): EntityValidationErrors<T>[] | undefined {
  if (errorData == null) {
    return;
  }

  if (Array.isArray(errorData)) {
    return errorData.map(error => Object
      .entries(error)
      .reduce((acc, [key, value]) => {
        acc[key as keyof T] = value[0] as EntityValidationErrors<T>[keyof T];
        return acc;
      }, {} as EntityValidationErrors<T>));
  }

  if (typeof errorData === 'object') {
    const key = Object.keys(errorData)[0] as keyof T;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    return extractEntityErrorMessages(errorData[key] as any);
  }
  return undefined;
}

/**
 * Extracts a string error from an array of errors.
 * @param errors Errors array.
 * @returns Extracted error string.
 */
function extractErrorMessageFromArray(errors: string[]): string {
  if (errors.length === 0) {
    throw new Error('Empty errors array');
  }
  const error = errors[0];
  if (typeof error !== 'string') {
    throw new Error(`String expected but ${typeof error} has gotten`);
  }
  return error;
}

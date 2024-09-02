import { HttpParams } from '@angular/common/http';

/**
 * Compose http params with param values.
 * @param paramValues Param values.
 */
export function composeHttpParams<T extends Record<string, string | number | boolean | null | undefined>>(
  paramValues: T,
): HttpParams {
  return Object.entries(paramValues).reduce((params, [key, value]) => {
    if (value != null && value !== '') {
      return params.set(key, value);
    }
    return params;
  }, new HttpParams());
}

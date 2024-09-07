import { HttpParams } from '@angular/common/http';

/**
 * Compose http params with param values.
 * @param paramValues Param values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function composeHttpParams<T extends Record<string, any>>(paramValues: T): HttpParams {
  return Object.entries(paramValues).reduce((params, [key, value]) => {
    if (value != null && value !== '') {
      return params.set(key, value);
    }
    return params;
  }, new HttpParams());
}

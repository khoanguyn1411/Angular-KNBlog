import { HttpParams } from '@angular/common/http';

/**
 * Compose http params with param values.
 * @param paramValues Param values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function composeHttpParams<T extends Record<string, any>>(paramValues: T): HttpParams {
  let httpParams = new HttpParams();
  Object.keys(paramValues).forEach((key) => {
    const value = paramValues[key];
    if (Array.isArray(value)) {
      value.forEach((v) => {
        httpParams = httpParams.append(`${key}[]`, v);
      });
      return;
    }
    if (value != null && value !== '') {
      httpParams = httpParams.append(key, value);
      return;
    }
  });
  return httpParams;
}

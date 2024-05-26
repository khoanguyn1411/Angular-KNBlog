import { HttpErrorResponse } from '@angular/common/http';
import { catchError, ObservableInput, ObservedValueOf, OperatorFunction } from 'rxjs';

/**
 * Catches http response errors on the observable to be handled by returning a new observable or throwing an error.
 * @param callback Errors selector.
 */
export function catchHttpErrorResponse<T, R extends ObservableInput<unknown>>(
	callback: (error: HttpErrorResponse) => R,
): OperatorFunction<T, T | ObservedValueOf<R>> {
	return catchError((error: unknown) => {
		if (error instanceof HttpErrorResponse) {
			return callback(error);
		}

		throw error;
	});
}

import { FormArray, FormGroup } from '@angular/forms';
import {
  Observable,
  OperatorFunction,
  Subject, throwError,
} from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  AppError, AppValidationError, EntityValidationErrors,
} from '../../models/app-error';
import { AppValidators } from '../validators';

/**
 * Util operator function to catch `AppValidationError` on presentational logic.
 * @param formOrSubject$ Subject to emit data if it was there.
 */
export function catchValidationData<T, R>(
  formOrSubject$: Subject<EntityValidationErrors<T>> | FormGroup,
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
): OperatorFunction<R, R | never> {
  return source$ =>
    source$.pipe(
      catchValidationError(({ validationData, message }) => {
        if (formOrSubject$ instanceof FormGroup) {
          fillFormWithError(formOrSubject$, validationData);
        } else {
          formOrSubject$.next(validationData);
        }

        return throwError(() => new AppError(message));
      }),
    );
}

/**
 * Fill the form with error data.
 * @param form Form to fill.
 * @param errors Array of errors.
 */
function fillFormWithError<T>(
  form: FormGroup,
  errors: EntityValidationErrors<T>,
): void {
  const controlKeys = Object.keys(form.controls) as (keyof T)[];
  controlKeys.forEach(key => {
    const error = errors[key];
    const control = form.controls[key as string];
    if (error && control) {
      // If error is not nested
      if (typeof error === 'string') {
        control.setErrors(AppValidators.buildAppError(error));
      } else if (control instanceof FormGroup && typeof error === 'object') {
        // Since we checked the error type, help typescript with error typing
        fillFormWithError(control, error as EntityValidationErrors<T[keyof T]>);
      } else if (control instanceof FormArray && Array.isArray(error)) {
        fillFormArrayWithError(control, error as EntityValidationErrors<T>[]);
      }
    }
  });
}

/**
 * Fill the form array with error data.
 * @param form Form to fill.
 * @param errors Array of errors.
 */
function fillFormArrayWithError<T>(
  form: FormArray,
  errors: EntityValidationErrors<T>[],
): void {
  errors.forEach((error, index) => {
    const control = form.at(index);
    if (control instanceof FormGroup) {
      fillFormWithError(control, error);
    } else if (typeof error === 'string') {
      control.setErrors(AppValidators.buildAppError(error));
    }
  });
}

/**
 * Catch application validation error (instance of AppValidationError) operator.
 * Catches only AppValidationError<T> errors.
 * @param selector Selector.
 */
export function catchValidationError<T, R>(
  selector: (error: AppValidationError<Record<string, unknown>>) => Observable<R>,
): OperatorFunction<T, T | R> {
  return catchError((error: unknown) => {
    if (error instanceof AppValidationError) {
      return selector(error);
    }
    return throwError(() => error);
  });
}

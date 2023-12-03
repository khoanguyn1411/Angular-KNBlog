import { AbstractControl } from '@angular/forms';
import { defer, Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export const DEFAULT_DEBOUNCE_TIME = 300;

/**
 * Listens control's `valueChanges` field.
 * Immediately starts with default value of the control.
 * Adds delay and emits value only if it was changed.
 * @param control Form control.
 * @param compare Function for distinctUntilChanged.
 * @param time Debounce time.
 */
export function listenControlChanges<T>(
  control: AbstractControl,
  time: number = DEFAULT_DEBOUNCE_TIME,
  compare?: (x: T, y: T) => boolean,
): Observable<T> {
  return defer(() =>
    control.valueChanges.pipe(
      startWith(control.value),
      debounceTime(time),
      distinctUntilChanged(compare),
    ));
}

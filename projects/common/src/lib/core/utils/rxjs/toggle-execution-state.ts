import { WritableSignal } from '@angular/core';
import { EMPTY, MonoTypeOperatorFunction, defer, merge } from 'rxjs';
import { finalize, ignoreElements, shareReplay } from 'rxjs/operators';

/**
 * Toggles loading subject when observable execution starts and ends.
 * Need to bind the context into `set` function to avoid unbound issue of class.
 * See: https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unbound-methods.md
 * @param setSignalCallback Set signal callback.
 * @example toggleExecutionState(this.isLoading.set.bind(this)),
 */
export function toggleExecutionState<T>(
  setSignalCallback: WritableSignal<boolean>['set'],
): MonoTypeOperatorFunction<T> {
  const startLoadingSideEffect$ = defer(() => {
    setSignalCallback(true);
    return EMPTY;
  });

  return (source$) => {
    const sharedSource$ = source$.pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
    const finishLoadingSideEffect$ = sharedSource$.pipe(
      ignoreElements(),
      finalize(() => setSignalCallback(false)),
    );

    return merge(
      startLoadingSideEffect$,
      finishLoadingSideEffect$,
      sharedSource$,
    );
  };
}

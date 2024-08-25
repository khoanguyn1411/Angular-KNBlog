import { WritableSignal } from '@angular/core';
import { defer, EMPTY, merge, MonoTypeOperatorFunction } from 'rxjs';
import { finalize, ignoreElements, shareReplay } from 'rxjs/operators';

/**
 * Toggles loading subject when observable execution starts and ends.
 * Need to bind the context into `set` function to avoid unbound issue of class.
 * See: https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unbound-methods.md
 * @param signalCallback Set signal callback.
 * @example toggleExecutionState(this.isLoading.set.bind(this)),
 */
export function toggleExecutionState<T>(signalCallback: WritableSignal<boolean>): MonoTypeOperatorFunction<T> {
  const startLoadingSideEffect$ = defer(() => {
    signalCallback.set(true);
    return EMPTY;
  });

  return (source$) => {
    const sharedSource$ = source$.pipe(shareReplay({ refCount: true, bufferSize: 1 }));
    const finishLoadingSideEffect$ = sharedSource$.pipe(
      ignoreElements(),
      finalize(() => signalCallback.set(false)),
    );

    return merge(startLoadingSideEffect$, finishLoadingSideEffect$, sharedSource$);
  };
}

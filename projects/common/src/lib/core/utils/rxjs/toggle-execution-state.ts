import { WritableSignal } from '@angular/core';
import { defer, EMPTY, merge, MonoTypeOperatorFunction, Subject } from 'rxjs';
import { finalize, ignoreElements, shareReplay } from 'rxjs/operators';

/**
 * Toggles loading subject or signal when observable execution starts and ends.
 * @param loadingIndicator$ Execution state of subject or signal.
 */
export function toggleExecutionState<T>(
  loadingIndicator$: Subject<boolean> | WritableSignal<boolean>,
): MonoTypeOperatorFunction<T> {
  const toggleLoadingIndicator = (value: boolean): void => {
    if (loadingIndicator$ instanceof Subject) {
      loadingIndicator$.next(value);
      return;
    }
    loadingIndicator$.set(value);
  };

  const startLoadingSideEffect$ = defer(() => {
    toggleLoadingIndicator(true);
    return EMPTY;
  });

  return (source$) => {
    const sharedSource$ = source$.pipe(shareReplay({ refCount: true, bufferSize: 1 }));
    const finishLoadingSideEffect$ = sharedSource$.pipe(
      ignoreElements(),
      finalize(() => toggleLoadingIndicator(false)),
    );

    return merge(startLoadingSideEffect$, finishLoadingSideEffect$, sharedSource$);
  };
}

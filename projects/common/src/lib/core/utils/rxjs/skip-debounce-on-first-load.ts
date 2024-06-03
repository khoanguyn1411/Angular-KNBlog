import { BehaviorSubject, MonoTypeOperatorFunction, timer } from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

const DEFAULT_DEBOUNCE_TIME = 300;

/** Skip debounce on first load. */
export function skipDebounceOnFirstLoad<T>(): MonoTypeOperatorFunction<T> {
  const isFirstLoad$ = new BehaviorSubject(true);

  return (source$) => {
    const sharedSource$ = source$.pipe(
      withLatestFrom(isFirstLoad$),
      switchMap(([data, isFirstLoad]) =>
        timer(isFirstLoad ? 0 : DEFAULT_DEBOUNCE_TIME).pipe(map(() => data)),
      ),
      tap(() => isFirstLoad$.next(false)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    return sharedSource$;
  };
}

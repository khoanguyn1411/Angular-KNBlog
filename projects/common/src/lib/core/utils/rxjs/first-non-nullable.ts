import { first, OperatorFunction } from 'rxjs';

/** Operator emits only first non-nullable value emitted by source Observable. */
export function firstNonNullable<T>(): OperatorFunction<T, NonNullable<T>> {
  return (source$) =>
    source$.pipe(first((val): val is NonNullable<T> => val != null));
}

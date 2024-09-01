/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineLatest, concat, merge, Observable, of, scan, switchMap } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { EMPTY_PAGINATION } from '@knb/core/constants/pagination';
import { Pagination } from '@knb/core/models/pagination';
import { filterNull } from './filter-null';
import { skipDebounceOnFirstLoad } from './skip-debounce-on-first-load';

/** Async pagination options. */
export type AsyncPaginationOptions<T> = {
  [K in keyof T]: Observable<T[K]>;
};

/**
 * Allows paginating data based on provided object containing async properties for pagination.
 * @param asyncOptions Async objects with pagination data.
 * @param fetch Fetch function that accepts the pagination options.
 * @example
 * ```ts
 * const searchString$ = new BehaviorSubject('');
 * const $ = new BehaviorSubject('');
 *
 * ```
 */
export function paginate<T, O>(
  asyncOptions: AsyncPaginationOptions<O>,
  fetch: (options: O) => Observable<Pagination<T>>,
): Observable<Pagination<T> | null> {
  return combineLatest(asyncOptions).pipe(
    // Skip debounce on first page load, then debounce with all the emissions after.
    skipDebounceOnFirstLoad(),
    switchMap((syncOptions) =>
      concat(
        // First, reset the state
        of(null),

        // After debounce time, fetch the value
        fetch(syncOptions),
      ),
    ),
  );
}

/**
 * Accumulate previous and current pagination items.
 * @param newPage New page.
 */
const onAdd =
  <T>(newPage: Pagination<T>) =>
  (currentPage: Pagination<T>) =>
    new Pagination({
      hasNext: newPage.hasNext,
      hasPrev: newPage.hasPrev,
      totalCount: newPage.totalCount,
      items: currentPage.items.concat(newPage.items),
    });

/** Clear pagination items. */
const onClear = () => () => EMPTY_PAGINATION;

/**
 * Accumulative pagination.
 * @param options Pagination options.
 * @param fetch Callback function for retrieving items.
 * @param clear$ Observable that emits whenever we need to clear accumulated data.
 */
export function accumulativePagination<TOptions extends Record<string, any>, TData extends Record<string, any>>(
  options: AsyncPaginationOptions<TOptions>,
  fetch: (options: TOptions) => Observable<Pagination<TData>>,
  clear$: Observable<unknown>,
): Observable<Pagination<TData> | null> {
  const page$ = paginate(options, fetch).pipe(filterNull());

  const onAdd$ = page$.pipe(map(onAdd));

  // We need to debounce the `onClear` source in the same way as the page source to prevent the empty pagination from appearing
  // before the page source is emitted.
  const onClear$ = clear$.pipe(map(onClear), skipDebounceOnFirstLoad());

  return merge(onAdd$, onClear$).pipe(
    scan((acc: Pagination<TData>, handlePagination) => handlePagination(acc), EMPTY_PAGINATION),
    startWith(EMPTY_PAGINATION),
  );
}

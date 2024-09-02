import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DEFAULT_PAGINATION_OPTIONS } from '@knb/core/constants/pagination';
import { Blog } from '@knb/core/models/blog';
import { BlogsFilterParams } from '@knb/core/models/blogs-filter-params';
import { Pagination } from '@knb/core/models/pagination';
import { filterNull } from '@knb/core/utils/rxjs/filter-null';
import { accumulativePagination } from '@knb/core/utils/rxjs/paginate';
import { toggleExecutionState } from '@knb/core/utils/rxjs/toggle-execution-state';
import { isEqual } from 'lodash';
import { delay, distinctUntilChanged, map, Observable, shareReplay, startWith } from 'rxjs';
import { BlogsApiService } from '../api-services/blogs-api.service';

@Injectable()
export class AccumulativeBlogsPageService {
  protected readonly blogsApiService = inject(BlogsApiService);

  public readonly blogsPage$: Observable<Pagination<Blog>>;
  public readonly isLoading = signal(false);

  protected readonly filters = signal(this.getDefaultFilters());
  protected readonly filters$ = toObservable(this.filters);

  public constructor() {
    this.blogsPage$ = this.initializeBlogsPage();
  }

  protected getDefaultFilters(): BlogsFilterParams {
    return {
      ...DEFAULT_PAGINATION_OPTIONS,
      userId: null,
      search: '',
    };
  }

  protected initializeBlogsPage(): Observable<Pagination<Blog>> {
    const onClear$ = this.filters$.pipe(
      startWith(this.getDefaultFilters()),
      map((filters) => [filters.pageSize, filters.userId, filters.search]),
      distinctUntilChanged((prev, next) => isEqual(prev, next)),
    );

    return accumulativePagination(
      // Using `debounceTime(0)` here to make the filter emits only 1 time after all changes has synchronously emitted.
      // eslint-disable-next-line rxjs/finnish
      { filters: this.filters$ },
      ({ filters }) => this.blogsApiService.getBlogs(filters).pipe(toggleExecutionState(this.isLoading)),
      onClear$,
    ).pipe(filterNull(), delay(5000), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  public setFilters(newFilters: Partial<BlogsFilterParams>) {
    this.filters.update((filters) => ({ ...filters, ...newFilters }));
  }

  public onLoadMoreClick() {
    this.filters.update((filters) => ({ ...filters, pageNumber: filters.pageNumber + 1 }));
  }
}

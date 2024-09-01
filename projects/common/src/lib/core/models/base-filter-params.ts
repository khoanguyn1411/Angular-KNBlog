import { SortOptions } from './sort-options';

/** Base filter parameters. */
export namespace BaseFilterParams {
  /** Search filter. */
  export type Search = {
    /** Search filter. */
    readonly search: string;
  };

  /** Pagination filters. */
  export type Pagination = {
    /** Page number filter. */
    readonly pageNumber: number;

    /** Page size filter. */
    readonly pageSize: number;
  };

  /** Sort filter. */
  export type Sort<T extends number | string> = {
    /** Field by which page should be sorted. */
    readonly sortOptions?: SortOptions<T>;
  };

  /** Search and pagination filters. */
  export type Combined<T extends number | string = string> = Search & Pagination & Sort<T>;
}

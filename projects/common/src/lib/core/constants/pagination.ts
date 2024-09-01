import { BaseFilterParams } from '../models/base-filter-params';
import { Pagination } from '../models/pagination';

/** Default pagination options. */
export const DEFAULT_PAGINATION_OPTIONS: BaseFilterParams.Pagination = {
  pageNumber: 0,
  pageSize: 10,
};

/** Default pagination options for file cards view. */
export const DEFAULT_FILE_CARDS_VIEW_PAGINATION_OPTIONS: BaseFilterParams.Pagination = {
  pageNumber: 0,
  pageSize: 15,
};

/** Default pagination options for job cards view. */
export const DEFAULT_JOB_CARDS_VIEW_PAGINATION_OPTIONS: BaseFilterParams.Pagination = {
  pageNumber: 0,
  pageSize: 12,
};

/** Empty pagination. */
export const EMPTY_PAGINATION = new Pagination({
  items: [],
  hasNext: false,
  hasPrev: false,
  totalCount: 0,
});

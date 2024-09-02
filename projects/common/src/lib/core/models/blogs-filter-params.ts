import { BaseFilterParams } from './base-filter-params';
import { User } from './user';

export type BlogsFilterParams = BaseFilterParams.Pagination &
  BaseFilterParams.Search & {
    readonly userId: User['id'] | null;
  };

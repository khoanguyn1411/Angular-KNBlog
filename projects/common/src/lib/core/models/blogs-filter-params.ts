import { BaseFilterParams } from './base-filter-params';
import { User } from './user';

export type BlogsFilterParams = BaseFilterParams.Pagination & {
  readonly userId: User['id'] | null;
};

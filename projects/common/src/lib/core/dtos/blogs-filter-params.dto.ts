import { BaseFilterParamsDto } from './base-filter-params.dto';

export type BlogsFilterParamsDto = BaseFilterParamsDto.Pagination & {
  readonly userId: string | undefined;
};

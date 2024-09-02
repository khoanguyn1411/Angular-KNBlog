import { BaseFilterParamsDto } from './base-filter-params.dto';

export type BlogsFilterParamsDto = BaseFilterParamsDto.Pagination &
  BaseFilterParamsDto.Search & {
    readonly userId: string | undefined;
  };

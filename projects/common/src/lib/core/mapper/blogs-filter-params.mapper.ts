import { Injectable, inject } from '@angular/core';
import { BlogsFilterParamsDto } from '../dtos/blogs-filter-params.dto';
import { BlogsFilterParams } from '../models/blogs-filter-params';
import { BaseFilterParamsMapper } from './base-filter-params.mapper';
import { MapperToDto } from './mappers';

/** Blogs filter params mapper. */
@Injectable({
  providedIn: 'root',
})
export class BlogsFilterParamsMapper implements MapperToDto<BlogsFilterParamsDto, BlogsFilterParams> {
  private readonly baseFilterParamsMapper = inject(BaseFilterParamsMapper);

  /** @inheritdoc */
  public toDto(data: BlogsFilterParams): BlogsFilterParamsDto {
    return {
      ...this.baseFilterParamsMapper.mapPaginationOptionsToDto(data),
    };
  }
}

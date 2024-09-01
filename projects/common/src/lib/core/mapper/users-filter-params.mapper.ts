import { Injectable, inject } from '@angular/core';
import { UsersFilterParamsDto } from '../dtos/users-filter-params.dto';
import { UsersFilterParams } from '../models/users-filter-params';
import { BaseFilterParamsMapper } from './base-filter-params.mapper';
import { MapperToDto } from './mappers';

/** User filter params mapper. */
@Injectable({
  providedIn: 'root',
})
export class UsersFilterParamsMapper implements MapperToDto<UsersFilterParamsDto, UsersFilterParams> {
  private readonly baseFilterParamsMapper = inject(BaseFilterParamsMapper);

  /** @inheritdoc */
  public toDto(data: UsersFilterParams): UsersFilterParamsDto {
    return {
      ...this.baseFilterParamsMapper.mapPaginationOptionsToDto(data),
    };
  }
}

import { Injectable } from '@angular/core';

import { PaginationDto } from '../dtos/pagination.dto';
import { Pagination } from '../models/pagination';

import { MapperFromDto } from './mappers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordAny = Record<string, any>;

/** Pagination mapper. */
@Injectable({ providedIn: 'root' })
export class PaginationMapper {
  /**
   * Map pagination from dto.
   * @param page Dto page.
   * @param mapper Mapper for the items.
   */
  public fromDto<TDto, TDomain extends RecordAny>(
    page: PaginationDto<TDto>,
    mapper: MapperFromDto<TDto, TDomain> | MapperFromDto<TDto, TDomain>['fromDto'],
  ): Pagination<TDomain> {
    const mapperFn = typeof mapper === 'function' ? mapper : mapper.fromDto.bind(mapper);
    return new Pagination({
      items: page.results.map(mapperFn),
      totalCount: page.count,
      hasNext: page.hasNext,
      hasPrev: page.hasPrev,
    });
  }
}

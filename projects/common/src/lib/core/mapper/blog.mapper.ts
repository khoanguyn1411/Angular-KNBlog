import { inject, Injectable } from '@angular/core';

import { BlogCreationDto, BlogDto } from '../dtos/blog.dto';
import { Blog, BlogCreation } from '../models/blog';
import { DateMapper } from './date.mapper';
import { MapperFromDto } from './mappers';

/** Blog mapper. */
@Injectable({
  providedIn: 'root',
})
export class BlogMapper implements MapperFromDto<BlogDto, Blog> {
  private readonly dateMapper = inject(DateMapper);

  /** @inheritdoc */
  public fromDto(dto: BlogDto): Blog {
    return {
      id: dto._id,
      writtenByUserId: dto.writtenBy._id,
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      bannerUrl: dto.bannerUrl,
      createdAt: this.dateMapper.fromDto(dto.createdAt),
      updatedAt: this.dateMapper.fromDto(dto.updatedAt),
    };
  }
  public toCreationDto(model: BlogCreation): BlogCreationDto {
    return {
      content: model.content,
      summary: model.summary,
      title: model.title,
      bannerUrl: model.bannerUrl ?? null,
    };
  }
}

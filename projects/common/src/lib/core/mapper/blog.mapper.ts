import { inject, Injectable } from '@angular/core';

import { BlogCreationDto, BlogDetailDto, BlogDto } from '../dtos/blog.dto';
import { Blog, BlogCreation, BlogDetail } from '../models/blog';
import { DateMapper } from './date.mapper';
import { MapperFromDto } from './mappers';
import { UserMapper } from './user.mapper';

/** Blog mapper. */
@Injectable({
  providedIn: 'root',
})
export class BlogMapper implements MapperFromDto<BlogDto, Blog> {
  private readonly dateMapper = inject(DateMapper);
  private readonly userMapper = inject(UserMapper);

  /** @inheritdoc */
  public fromDto(dto: BlogDto): Blog {
    return {
      id: dto._id,
      writtenByUser: this.userMapper.fromDto(dto.writtenBy),
      title: dto.title,
      summary: dto.summary,
      bannerUrl: dto.bannerUrl,
      createdAt: this.dateMapper.fromDto(dto.createdAt),
      updatedAt: this.dateMapper.fromDto(dto.updatedAt),
    };
  }

  /** @inheritdoc */
  public fromDetailDto(dto: BlogDetailDto): BlogDetail {
    return {
      ...this.fromDto(dto),
      content: dto.content,
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

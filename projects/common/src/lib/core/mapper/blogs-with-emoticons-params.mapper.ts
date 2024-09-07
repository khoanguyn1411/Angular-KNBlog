import { Injectable } from '@angular/core';
import { BlogsWithEmoticonsParamsDto } from '../dtos/blogs-with-emoticons-params.dto';
import { BlogsWithEmoticonsParams } from '../models/blogs-with-emoticons-params';
import { MapperToDto } from './mappers';

/** Blogs with emoticons params mapper. */
@Injectable({
  providedIn: 'root',
})
export class BlogsWithEmoticonsParamsMapper
  implements MapperToDto<BlogsWithEmoticonsParamsDto, BlogsWithEmoticonsParams>
{
  /** @inheritdoc */
  public toDto(data: BlogsWithEmoticonsParams): BlogsWithEmoticonsParamsDto {
    return {
      blogIds: data.blogIds,
    };
  }
}

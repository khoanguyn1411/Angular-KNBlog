import { Injectable } from '@angular/core';

import { BlogCreationDto } from '../dtos/blog.dto';
import { BlogCreation } from '../models/blog';

/** Blog mapper. */
@Injectable({
  providedIn: 'root',
})
export class BlogMapper {
  /** @inheritdoc */
  public toCreationDto(model: BlogCreation): BlogCreationDto {
    return {
      content: model.content,
      summary: model.summary,
      title: model.title,
      bannerUrl: model.bannerUrl ?? undefined,
    };
  }
}

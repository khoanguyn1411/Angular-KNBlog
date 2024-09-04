import { Injectable } from '@angular/core';

import { EmoticonCreationDto } from '../dtos/emoticon.dto';
import { EmoticonCreation } from '../models/emoticon';

/** Emoticon mapper. */
@Injectable({
  providedIn: 'root',
})
export class EmoticonMapper {
  public toCreationDto(model: EmoticonCreation): EmoticonCreationDto {
    return {
      blogId: model.blogId,
    };
  }
}

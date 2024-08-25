import { Injectable } from '@angular/core';

import { UploadResultDto } from '../dtos/upload-result.dto';
import { UploadResult } from '../models/upload-result';
import { MapperFromDto } from './mappers';

/** Upload result mapper. */
@Injectable({
  providedIn: 'root',
})
export class UploadResultMapper implements MapperFromDto<UploadResultDto, UploadResult> {
  /** @inheritdoc */
  public fromDto(dto: UploadResultDto): UploadResult {
    return {
      viewUrl: dto.viewUrl,
      downloadUrl: dto.downloadUrl,
      driveViewUrl: dto.driveViewUrl,
    };
  }
}

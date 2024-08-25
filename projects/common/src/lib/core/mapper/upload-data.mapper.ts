import { Injectable } from '@angular/core';

import { UploadData } from '../models/upload-data';
import { MapperToDto } from './mappers';

/** Upload data mapper. */
@Injectable({
  providedIn: 'root',
})
export class UploadDataMapper implements MapperToDto<FormData, UploadData> {
  public toDto(model: UploadData): FormData {
    const formData = new FormData();
    formData.append('file', model.file);
    return formData;
  }
}

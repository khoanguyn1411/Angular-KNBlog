import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { uploadResultSchemaDto } from '@knb/core/dtos/upload-result.dto';
import { UploadDataMapper } from '@knb/core/mapper/upload-data.mapper';
import { UploadResultMapper } from '@knb/core/mapper/upload-result.mapper';
import { UploadData } from '@knb/core/models/upload-data';
import { UploadResult } from '@knb/core/models/upload-result';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUrlsConfig } from './app-urls.config';

@Injectable({ providedIn: 'root' })
export class UploadApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrls = inject(AppUrlsConfig);
  private readonly uploadDataMapper = inject(UploadDataMapper);
  private readonly uploadResultMapper = inject(UploadResultMapper);

  public uploadImage(uploadData: UploadData): Observable<UploadResult> {
    const uploadDataDto = this.uploadDataMapper.toDto(uploadData);
    return this.httpClient.post<unknown>(this.apiUrls.upload.image, uploadDataDto).pipe(
      map((response) => uploadResultSchemaDto.parse(response)),
      map((dataDto) => this.uploadResultMapper.fromDto(dataDto)),
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmoticonMapper } from '@knb/core/mapper/emoticon.mapper';
import { Blog } from '@knb/core/models/blog';
import { EmoticonCreation } from '@knb/core/models/emoticon';
import { map, Observable } from 'rxjs';
import { AppUrlsConfig } from './app-urls.config';

@Injectable({ providedIn: 'root' })
export class EmoticonApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrls = inject(AppUrlsConfig);
  private readonly emoticonMapper = inject(EmoticonMapper);

  public addEmoticon(emoticon: EmoticonCreation): Observable<void> {
    const emoticonDto = this.emoticonMapper.toCreationDto(emoticon);
    return this.httpClient.post(this.apiUrls.emoticon.add, emoticonDto).pipe(map(() => undefined));
  }

  public removeEmoticon(blogId: Blog['id']): Observable<void> {
    return this.httpClient.delete(this.apiUrls.emoticon.remove(blogId)).pipe(map(() => undefined));
  }
}

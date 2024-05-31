import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { userDtoSchema } from '@knb/core/dtos/user.dto';
import { UserMapper } from '@knb/core/mapper/user.mapper';
import { User } from '@knb/core/models/user';
import { Observable, map } from 'rxjs';
import { AppUrlsConfig } from './app-urls.config';

/** Performs CRUD operations for users. */
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly apiUrls = inject(AppUrlsConfig);

  private readonly httpClient = inject(HttpClient);

  private readonly userMapper = inject(UserMapper);

  /** Returns current user info.*/
  public getCurrentUser(): Observable<User> {
    return this.httpClient.get<unknown>(this.apiUrls.user.profile).pipe(
      map((response) => userDtoSchema.parse(response)),
      map((userDto) => this.userMapper.fromDto(userDto))
    );
  }
}

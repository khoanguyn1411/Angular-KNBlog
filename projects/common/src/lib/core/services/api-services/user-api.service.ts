import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { createPaginationDtoSchema } from '@knb/core/dtos/pagination.dto';
import { userDtoSchema } from '@knb/core/dtos/user.dto';
import { PaginationMapper } from '@knb/core/mapper/pagination.mapper';
import { UserMapper } from '@knb/core/mapper/user.mapper';
import { UsersFilterParamsMapper } from '@knb/core/mapper/users-filter-params.mapper';
import { Pagination } from '@knb/core/models/pagination';
import { User, UserUpdate } from '@knb/core/models/user';
import { UsersFilterParams } from '@knb/core/models/users-filter-params';
import { safeParse } from '@knb/core/utils/safe-parse';
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
  private readonly usersFilterParamsMapper = inject(UsersFilterParamsMapper);
  private readonly paginationMapper = inject(PaginationMapper);

  /** Returns current user info.*/
  public getCurrentUser(): Observable<User> {
    return this.httpClient.get<unknown>(this.apiUrls.user.profile).pipe(
      map((response) => userDtoSchema.parse(response)),
      map((userDto) => this.userMapper.fromDto(userDto)),
    );
  }

  /**
   * Returns users list.
   * @param filters Filters.
   */
  public getUsers(filters: UsersFilterParams): Observable<Pagination<User>> {
    const filtersDto = this.usersFilterParamsMapper.toDto(filters);
    return this.httpClient.get<unknown>(this.apiUrls.user.list, { params: filtersDto }).pipe(
      map((response) => safeParse(createPaginationDtoSchema(userDtoSchema), response)),
      map((pagination) => this.paginationMapper.fromDto(pagination, (userDto) => this.userMapper.fromDto(userDto))),
    );
  }

  /**
   * Update user.
   * @param id User ID.
   * @param userUpdate User update data.
   */
  public updateUser(id: User['id'], userUpdate: UserUpdate): Observable<User> {
    const userUpdateDto = this.userMapper.toCreationDto(userUpdate);
    return this.httpClient.post<unknown>(this.apiUrls.user.updateUser(id), userUpdateDto).pipe(
      map((response) => userDtoSchema.parse(response)),
      map((userDto) => this.userMapper.fromDto(userDto)),
    );
  }
}

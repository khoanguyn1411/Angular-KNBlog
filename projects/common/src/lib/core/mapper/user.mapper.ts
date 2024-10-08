import { Injectable } from '@angular/core';

import { UserDto, UserUpdateDto } from '../dtos/user.dto';
import { User, UserUpdate } from '../models/user';
import { MapperFromDto } from './mappers';

/** User mapper. */
@Injectable({
  providedIn: 'root',
})
export class UserMapper implements MapperFromDto<UserDto, User> {
  /** @inheritdoc */
  public fromDto(dto: UserDto): User {
    return {
      id: dto._id,
      firstName: dto.firstName,
      lastLogin: dto.lastLogin,
      lastName: dto.lastName,
      role: dto.role,
      email: dto.email,
      pictureUrl: dto.pictureUrl,
      fullName: User.getFullName(dto.firstName, dto.lastName),
    };
  }

  /** @inheritdoc */
  public toCreationDto(model: UserUpdate): UserUpdateDto {
    return {
      firstName: model.firstName,
      lastName: model.lastName,
      pictureUrl: model.pictureUrl,
    };
  }
}

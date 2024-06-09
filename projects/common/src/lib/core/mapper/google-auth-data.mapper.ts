import { Injectable } from '@angular/core';

import { GoogleAuthDataDto } from '../dtos/google-auth-data.dto';
import { GoogleAuthData } from '../models/google-auth-data';
import { MapperToDto } from './mappers';

/** Google auth data mapper. */
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthDataMapper implements MapperToDto<GoogleAuthDataDto, GoogleAuthData> {
  /** @inheritdoc */
  public toDto(data: GoogleAuthData): GoogleAuthDataDto {
    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      googleTokenId: data.googleTokenId,
      pictureUrl: data.pictureUrl,
    };
  }
}

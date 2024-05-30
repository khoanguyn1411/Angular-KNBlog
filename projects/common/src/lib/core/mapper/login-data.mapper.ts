import { Injectable } from '@angular/core';

import { EntityValidationErrors } from '../models/app-error';

import { MapperToDto, ValidationErrorMapper } from './mappers';
import { ValidationErrorDto, extractErrorMessage } from '../dtos/validation-error.dto';
import { LoginDataDto } from '../dtos/login-data.dto';
import { LoginData } from '../models/login-data';


/** Login data mapper. */
@Injectable({
  providedIn: 'root',
})
export class LoginDataMapper
implements
    MapperToDto<LoginDataDto, LoginData>,
    ValidationErrorMapper<LoginDataDto, LoginData> {
  /** @inheritdoc */
  public validationErrorFromDto(
    errorDto: ValidationErrorDto<LoginDataDto> | null | undefined,
  ): EntityValidationErrors<LoginData> {
    return {
      email: extractErrorMessage(errorDto?.email),
      password:
        extractErrorMessage(errorDto?.password) ??
        extractErrorMessage(errorDto?.nonFieldErrors),
    };
  }

  /** @inheritdoc */
  public toDto(data: LoginData): LoginDataDto {
    return data;
  }
}

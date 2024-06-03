import { Injectable } from '@angular/core';

import { EntityValidationErrors } from '../models/app-error';

import { RegisterDataDto } from '../dtos/register-data.dto';
import {
  ValidationErrorDto,
  extractErrorMessage,
} from '../dtos/validation-error.dto';
import { RegisterData } from '../models/register-data';
import { MapperToDto, ValidationErrorMapper } from './mappers';

/** Register data mapper. */
@Injectable({
  providedIn: 'root',
})
export class RegisterDataMapper
  implements
    MapperToDto<RegisterDataDto, RegisterData>,
    ValidationErrorMapper<RegisterDataDto, RegisterData>
{
  /** @inheritdoc */
  public validationErrorFromDto(
    errorDto: ValidationErrorDto<RegisterDataDto> | null | undefined,
  ): EntityValidationErrors<RegisterData> {
    return {
      email: extractErrorMessage(errorDto?.email),
      password: extractErrorMessage(errorDto?.password),
      firstName: extractErrorMessage(errorDto?.firstName),
      lastName: extractErrorMessage(errorDto?.lastName),
      pictureUrl: extractErrorMessage(errorDto?.pictureUrl),
      nonFieldErrors: extractErrorMessage(errorDto?.nonFieldErrors),
    };
  }

  /** @inheritdoc */
  public toDto(data: RegisterData): RegisterDataDto {
    return data;
  }
}

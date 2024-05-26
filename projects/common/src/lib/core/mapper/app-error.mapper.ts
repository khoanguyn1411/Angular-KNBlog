import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, throwError } from 'rxjs';

import { AppError, AppValidationError } from '../models/app-error';
import { catchHttpErrorResponse } from '../utils/rxjs/catch-http-error-response';

import { ValidationErrorMapper } from './mappers';
import { ApiError } from '../dtos/validation-error.dto';

/**
 * Could be a simple function that transform errors from DTO to domain-level errors
 * or an implementation of `IMapper` with implemented `validationErrorFromDto` method.
 */
export type ErrorMapper<TDto, TEntity extends Record<string, unknown>> =
| ValidationErrorMapper<TDto, TEntity>
| ValidationErrorMapper<TDto, TEntity>['validationErrorFromDto'];

/**
 * Errors mapper.
 */
@Injectable({ providedIn: 'root' })
export class AppErrorMapper {
  /**
   * Maps `HttpErrorResponse` to an application-level error.
   * @param httpError Http error response.
   */
  private fromDto(httpError: HttpErrorResponse): AppError {
    const { statusText, error } = httpError;
    return new AppError(error?.detail ?? statusText);
  }

  /**
   * Maps `HttpErrorResponse` to either `AppError` or `AppValidationError`.
   * @param httpError Http error.
   * @param mapper Mapper for backend-provided validation data into domain validation data.
   */
  private fromDtoWithValidationSupport<TDto, TEntity extends Record<string, unknown>>(
    httpError: HttpErrorResponse,
    mapper: ErrorMapper<TDto, TEntity>,
  ): AppError | AppValidationError<TEntity> {
    if (httpError.status !== HttpStatusCode.BadRequest) {
      return this.fromDto(httpError);
    }

    const { error }: {readonly error: ApiError<TDto> | undefined;} = httpError;
    if (error?.data == null) {
      return this.fromDto(httpError);
    }

    const validationData =
      typeof mapper === 'function' ?
        mapper(error.data) :
        mapper.validationErrorFromDto(error.data);
    return new AppValidationError<TEntity>(error.detail, validationData);
  }

  /**
   * RxJS operator that catches `HttpErrorResponse` and maps it into application error.
   */
  public catchHttpErrorToAppError<T>(): MonoTypeOperatorFunction<T> {
    return catchHttpErrorResponse(error => {
      const appError = this.fromDto(error);
      return throwError(() => appError);
    });
  }

  /**
   * RxJS operator that catches `HttpErrorResponse` and maps it into application error that may contain validation data.
   * @param mapper Mapper for backend-provided validation data into domain validation data.
   */
  public catchHttpErrorToAppErrorWithValidationSupport<
    T,
    TDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TEntity extends Record<string, any>,
  >(mapper: ErrorMapper<TDto, TEntity>): MonoTypeOperatorFunction<T> {
    return catchHttpErrorResponse(error => {
      const appError = this.fromDtoWithValidationSupport<TDto, TEntity>(
        error,
        mapper,
      );
      return throwError(() => appError);
    });
  }
}

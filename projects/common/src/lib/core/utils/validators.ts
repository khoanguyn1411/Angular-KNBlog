import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ValidationErrorCode } from '../models/validation-error-code';

export namespace AppValidators {

  /**
   * Checks whether the current control matches another.
   * @param controlName Control name to check matching with.
   * @param controlTitle Control title to display for a user.
   */
  export function matchControl(
    controlName: string,
    controlTitle = controlName,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        control.parent &&
        control.parent.get(controlName)?.value !== control.value
      ) {
        return {
          [ValidationErrorCode.Match]: {
            controlName,
            controlTitle,
          },
        };
      }
      return null;
    };
  }

  /**
   * Create validation error from a message.
   * @param message Message to create an error from.
   */
  export function buildAppError(message: string): ValidationErrors {
    return {
      [ValidationErrorCode.AppError]: {
        message,
      },
    };
  }
}

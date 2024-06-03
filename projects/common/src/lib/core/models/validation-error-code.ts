/**
 * Validation error code.
 */
export enum ValidationErrorCode {
  /**
   * Wrong email.
   */
  Email = 'email',

  /**
   * Required field.
   */
  Required = 'required',

  /**
   * Match of values error. When value of one control does not match to another.
   */
  Match = 'match',

  /**
   * Minimal length restriction.
   */
  MinLength = 'minlength',

  /**
   * Maximal length restriction.
   */
  MaxLength = 'maxlength',

  /**
   * Maximum value restriction.
   */
  Min = 'min',

  /**
   * Minimum value restriction.
   */
  Max = 'max',

  /**
   * Pattern restriction.
   */
  Pattern = 'pattern',

  /**
   * Custom error.
   */
  AppError = 'appError',

  /**
   * Value is greater than the compared one.
   */
  Greater = 'greater',
}

/**
 * Match validation error data.
 */
export type MatchErrorData = {
  /**
   * Control name.
   */
  controlName: string;

  /**
   * Control title.
   */
  controlTitle: string;
};

/**
 * Length validation error data.
 */
export type LengthErrorData = {
  /**
   * Actual length.
   */
  actualLength: number;

  /**
   * Required length.
   */
  requiredLength: number;
};

/**
 * Pattern validation error data.
 */
export type PatternErrorData = {
  /**
   * Actual length.
   */
  actualValue: string;

  /**
   * Required length.
   */
  requiredPattern: string;
};

/**
 * App validation error data.
 */
export type AppErrorData = {
  /**
   * Message.
   */
  message: string;
};

/**
 * Min value validation error data.
 */
export type MinValueErrorData = {
  /**
   * Actual value.
   */
  actual: number;

  /**
   * Min value.
   */
  min: number;
};

/**
 * Max value validation error data.
 */
export type MaxValueErrorData = {
  /**
   * Actual value.
   */
  actual: number;

  /**
   * Min value.
   */
  max: number;
};

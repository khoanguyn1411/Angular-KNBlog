/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormArray,
  FormControl,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Performs flat parsing of provided type and creates control for each of its fields.
 * @example
 * ```ts
 * interface Person {
 *   readonly name: string;
 *   readonly age: number;
 * }
 *```
 * Result:
 *```ts
 * interface Person {
 *   readonly name: FromControl<string>;
 *   readonly age: FormControl<number>;
 * }
 *```ts
 */
export type FlatControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends AbstractControl
    ? T[K]
    : FormControl<T[K]>;
};

/**
 * Performs deeply parsing of provided type and creates controls for each of its fields.
 * @example
 *```ts
 * interface Car {
 *  readonly name: string;
 *  readonly mark: string;
 * }
 *
 * interface Person {
 *   readonly name: string;
 *   readonly age: number;
 *   readonly cars: readonly Car[];
 * }
 * ```
 *
 * Result:
 *```ts
 * interface Person {
 *   readonly name: FromControl<string>;
 *   readonly age: FormControl<number>;
 *   readonly children: FormArray<FormGroup<Car>>;
 * }
 *```
 */
export type DeepControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends AbstractControl
    ? T[K]
    : NonUndefined<T[K]> extends readonly (infer R)[]
      ? R extends Record<string, any>
        ? FormArray<FormGroup<DeepControlsOf<R>>>
        : FormArray<FormControl<R>>
      : NonUndefined<T[K]> extends Record<string, any>
        ? FormGroup<DeepControlsOf<T[K]>>
        : FormControl<T[K]>;
};

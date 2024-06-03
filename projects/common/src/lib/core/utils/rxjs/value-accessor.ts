import {
  ChangeDetectorRef,
  Directive,
  forwardRef,
  ForwardRefFn,
  inject,
  Input,
  Provider,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

/**
 * Create provider for a control.
 * @param factory Factory providing a reference to control component class.
 */
export function controlProviderFor(factory: ForwardRefFn): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(factory),
    multi: true,
  };
}

/**
 * Create validator provider for a control.
 * @param factory Factory providing a reference to control component class.
 */
export function validatorProviderFor(factory: ForwardRefFn): Provider {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(factory),
    multi: true,
  };
}

type OnChangeFn<V> = (opt: V | null) => void;
type OnTouchedFn = () => void;
type OnDisabledFn = (disabled: boolean) => void;

/** Base implementation of Angular's control value accessor. */
@Directive()
export abstract class BaseValueAccessor<V> implements ControlValueAccessor {
  /** Whether the control should be disabled. */
  @Input()
  public set disabled(d: boolean) {
    this._disabled = d;
    this.onDisabledFn.forEach((fn) => fn(d));
  }

  /** Whether the control should be disabled. */
  public get disabled(): boolean {
    return this._disabled;
  }

  private _disabled = false;

  private isTouched = false;

  private readonly onChangeFn: OnChangeFn<V>[] = [];

  private readonly onTouchedFn: OnTouchedFn[] = [];

  private readonly onDisabledFn: OnDisabledFn[] = [];

  /**
   * Saves the Angular's onChange callbacks so to call them whenever the value is changed.
   * @param fn Callback.
   */
  public registerOnChange(fn: OnChangeFn<V>): void {
    this.onChangeFn.push(fn);
  }

  /**
   * Saves onTouched callback which will be called once the value is changed.
   * @param fn Callback.
   */
  public registerOnTouched(fn: OnTouchedFn): void {
    this.onTouchedFn.push(fn);
  }

  /**
   * Saves onDisabled callback which will be called whenever the control is disabled/enabled.
   * @param fn Callback.
   */
  protected registerOnDisabled(fn: OnDisabledFn): void {
    this.onDisabledFn.push(fn);
  }

  /**
   * Called whenever the Angular's FormControl is set to be disabled.
   * @param d Disabled state.
   */
  public setDisabledState(d: boolean): void {
    this.disabled = d;
  }

  /**
   * Emit change callbacks.
   * @param value Value to emit.
   */
  protected emitChange(value: V | null): void {
    if (!this.isTouched) {
      this.emitTouched();
    }
    this.onChangeFn.forEach((fn) => fn(value));
  }

  private emitTouched(): void {
    this.isTouched = true;
    this.onTouchedFn.forEach((fn) => fn());
  }

  /** @inheritdoc */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeValue(_value: V | null): void {
    // will optionally be implemented by the descendants.
  }
}

/**
 * Simple synchronous value accessor implementation. Has a synchronous `controlValue` property that contains a value.
 * Reduces boilerplate needed for implementing custom controls via
 * Angular's [`ControlValueAccessor`](https://angular.io/api/forms/ControlValueAccessor).
 * @see ControlValueAccessor.
 */
// Angular requires some decorator so that DI would get things right, Directive is added to avoid specifying Component's metadata.
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class SimpleValueAccessor<V> extends BaseValueAccessor<V> {
  /** Change detector reference. */
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);

  /** Current radio group value. */
  public set controlValue(v: V | null) {
    this._value = v;
    this.emitChange(this._value);
  }

  /** Value. */
  public get controlValue(): V | null {
    return this._value ?? null;
  }

  private _value: V | null | undefined;

  /**
   * Used by Angular to write when assigned FormControl is changed.
   * @param value Value passed from the outside of value accessor by Angular's FormControl.
   * `null` when form is initialized without initial data.
   */
  public override writeValue(value: V | null): void {
    this._value = value;
    this.changeDetectorRef.markForCheck();
  }

  /** @inheritDoc */
  public override setDisabledState(d: boolean): void {
    super.setDisabledState(d);
    this.changeDetectorRef.markForCheck();
  }
}

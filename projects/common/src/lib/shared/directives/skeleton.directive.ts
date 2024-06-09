/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, ElementRef, HostBinding, Input, OnChanges } from '@angular/core';

/**
 * Generates random value between specified ranges using linear random generator.
 * @param max Max limit.
 * @param min Min.
 */
export function generateRandomInRange(max: number, min: number): number {
  return Math.random() * (max - min) + min;
}

/** The directive applies a skeleton class whenever the passed value is void. */
@Directive({ selector: '[kncSkeleton]', standalone: true })
export class SkeletonDirective implements OnChanges {
  /** The value to check whether the skeleton should be applied. */
  @Input('kncSkeleton')
  public value?: unknown;

  /** The skeleton class binding. */
  @HostBinding('class.knc-skeleton')
  public get skeletonClass(): boolean {
    return this.value == null || this.value === '';
  }

  /** Min width to generate. */
  @Input('kncSkeletonMinWidth')
  public min: number | undefined;

  /** Max width to generate. */
  @Input('kncSkeletonMaxWidth')
  public max: number | undefined;

  /** Whether skeleton is rounded. */
  @Input('kncSkeletonRounded')
  public isRounded: boolean = false;

  /** CSS width units. */
  @Input()
  public kncWidthUnits = 'ch';

  /** Width of skeleton in `kncWidthUnits`. */
  @HostBinding('style.width')
  public get _width(): string | undefined {
    if (this.width != null) {
      return `${this.width}${this.kncWidthUnits}`;
    }

    return undefined;
  }

  /** Display binding. If width attribute is passed, display inline-block is set so that the width would work. */
  @HostBinding('style.display')
  public get _display(): string {
    if (this.width != null) {
      return `inline-block`;
    }

    return this.elementRef.nativeElement.style.display;
  }

  @HostBinding('style.border-radius')
  public get _borderRadius(): string | undefined {
    if (this.isRounded) {
      return '50%';
    }
    return undefined;
  }

  private width: number | null = null;

  public constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  /** @inheritdoc */
  public ngOnChanges(): void {
    if (this.max == null || this.min == null) {
      return;
    }

    const valueIsPresent = this.value != null && this.value !== '';
    if (valueIsPresent) {
      this.width = null;
    } else {
      this.width = generateRandomInRange(this.min, this.max);
    }
  }
}

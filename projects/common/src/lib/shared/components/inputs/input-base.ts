import { Directive, inject, input } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { SimpleValueAccessor } from '@knb/core/utils/rxjs/value-accessor';

/** Base input. */
@Directive()
export abstract class InputBase extends SimpleValueAccessor<string | number | null> {
	/** Input label. */
	public readonly label = input('');

	/** Input placeholder. */
	public readonly placeholder = input('');

	/** Provides a hint to the browser about what the value of the field should be. */
	public readonly autocomplete = input<HTMLInputElement['autocomplete']>('off');

	private readonly ngControl = inject(NgControl, {
		self: true,
	});

	/** Form control. */
	public get formControl(): FormControl<string | number | null> {
		return this.ngControl.control as FormControl<string | number | null>;
	}

	public constructor() {
		super();
		this.ngControl.valueAccessor = this;
	}
}

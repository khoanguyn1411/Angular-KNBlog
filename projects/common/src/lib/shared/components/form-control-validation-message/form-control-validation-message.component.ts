import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, DoCheck, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { listenControlTouched } from '@knb/core/utils/rxjs/listen-control-touched';
import { BehaviorSubject, EMPTY, merge, tap } from 'rxjs';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';


/**
 * Form control validation message component.
 * Render error message for the target form control.
 */
@Component({
	selector: 'knc-form-control-validation-message',
	templateUrl: './form-control-validation-message.component.html',
	styleUrls: ['./form-control-validation-message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [ValidationMessageComponent, AsyncPipe],
})
export class FormControlValidationMessageComponent implements OnInit, DoCheck {
	/** Target form control name. */
	@Input()
	public controlName?: string;

	/** Target form control. */
	@Input()
	public control?: AbstractControl;

	/** Form control. */
	protected readonly formControl$ = new BehaviorSubject<AbstractControl | undefined>(undefined);

	private readonly parent = inject(ControlContainer, { optional: true, skipSelf: true, host: true });

	private readonly destroyRef = inject(DestroyRef);

	/** @inheritdoc */
	public ngOnInit(): void {
		this.initErrorSideEffect();
	}

	/** @inheritdoc */
	public ngDoCheck(): void {
		// Re-get form control on do check, because parent FormControl could be re-created.
		let formControl = this.control;
		if (this.controlName != null) {
			formControl = this.parent?.control?.get(this.controlName.toString()) as AbstractControl | undefined;
		}
		this.formControl$.next(formControl);
	}

	/**
	 * Should error message be displayed.
	 * @param control Control to check.
	 */
	public shouldDisplayErrorMessage(control: AbstractControl): boolean {
		// Display if a user changed value or value already presented (pre-initialized).
		const hasValue = control.value != null && control.value !== '';

		return control.touched || control.dirty || (hasValue && control.errors != null);
	}

	private initErrorSideEffect(): void {
		if (this.control != null && this.controlName != null) {
			throw new Error('You can not specify the both: `control` and `controlName`. Use only one of them.');
		}

		const control = this.controlName != null ? this.parent?.control?.get(this.controlName.toString()) : this.control;
		if (control == null) {
			throw new Error('Cannot find an abstract control with specified name');
		}

		merge(this.parent?.statusChanges ?? EMPTY, listenControlTouched(control), control.statusChanges)
			.pipe(
				tap(() => this.formControl$.next(control)),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe();
	}
}

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { FormControlValidationMessageComponent } from '../../form-control-validation-message/form-control-validation-message.component';
import { InputBase } from '../input-base';
import { MatButtonModule } from '@angular/material/button';

/** Password component. */
@Component({
	selector: 'knc-password',
	templateUrl: './password.component.html',
	styleUrl: './password.component.css',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Default,
	imports: [
		MatInputModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		FormControlValidationMessageComponent,
		MatIconModule,
    MatButtonModule,
	],
})
export class PasswordComponent extends InputBase {

	/** Whether password is shown. */
	protected readonly isShowPassword = signal(false);

	/** Password type. */
	protected readonly type = computed(() => this.isShowPassword() ? 'text' : 'password');

	/** Toggle password. */
	protected togglePassword(): void {
		this.isShowPassword.update(value => !value);
	}

}

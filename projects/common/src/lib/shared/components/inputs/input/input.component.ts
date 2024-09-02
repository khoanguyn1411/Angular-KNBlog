import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { FormControlValidationMessageComponent } from '../../form-control-validation-message/form-control-validation-message.component';
import { InputBase } from '../input-base';

/** Input component. */
@Component({
  selector: 'knc-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormControlValidationMessageComponent,
    MatIconModule,
  ],
})
export class InputComponent extends InputBase {
  /** Input type. */
  public readonly type = input<HTMLInputElement['type']>('text');

  /** Input name. */
  public readonly name = input<HTMLInputElement['name']>('');

  public readonly focus = output();
  public readonly blur = output();

  public onFocus() {
    this.focus.emit();
  }

  public onBlur() {
    this.blur.emit();
  }

  /**
   * Handle input change.
   * @param event HTML input event.
   */
  protected onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    if (this.type() === 'number') {
      const parsedNumber = Number.parseFloat(value);
      if (Number.isNaN(parsedNumber)) {
        this.formControl.setValue(null);
      } else {
        this.formControl.setValue(parsedNumber);
      }
    } else {
      this.formControl.setValue(value);
    }
  }
}

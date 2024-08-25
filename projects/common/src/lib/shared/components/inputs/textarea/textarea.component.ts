import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControlValidationMessageComponent } from '../../form-control-validation-message/form-control-validation-message.component';
import { InputBase } from '../input-base';

/** Textarea component. */
@Component({
  selector: 'knc-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './textarea.component.scss',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormControlValidationMessageComponent,
    MatIconModule,
  ],
})
export class TextareaComponent extends InputBase {
  /** Input name. */
  public readonly name = input<HTMLInputElement['name']>('');

  /**
   * Handle input change.
   * @param event HTML input event.
   */
  protected onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    this.formControl.setValue(value);
  }
}

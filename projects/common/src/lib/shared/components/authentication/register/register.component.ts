import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';

/** Register component. */
@Component({
  selector: 'knc-register',
  standalone: true,
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

}

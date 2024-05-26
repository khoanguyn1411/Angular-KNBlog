import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';

/** Login component. */
@Component({
  selector: 'knc-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';

/** Global search component. */
@Component({
  selector: 'knc-global-search',
  standalone: true,
  templateUrl: './global-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent, ReactiveFormsModule, MatIconModule],
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent {
  protected readonly control = new FormControl('');
}

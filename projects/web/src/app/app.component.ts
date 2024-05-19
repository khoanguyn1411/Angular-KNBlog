import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputComponent } from '@knb/shared/components/inputs/input/input.component';
import { LayoutComponent } from '@knb/shared/layout/layout.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'knw-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  protected title = 'web';

  protected title$ = new Observable();

  protected formControl = new FormControl("")
}

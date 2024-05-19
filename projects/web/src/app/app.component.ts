import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '@knb/shared/layout/layout.component';
import { Observable } from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'knw-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,FormsModule, LayoutComponent, MatInputModule, MatFormFieldModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  protected title = 'web';

  protected title$ = new Observable();
}

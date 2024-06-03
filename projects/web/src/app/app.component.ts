import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from '@knb/shared/layouts/app-layout/app-layout.component';
import { ThemeProviderComponent } from '@knb/shared/providers/theme-provider/theme-provider.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'knw-root',
  standalone: true,
  imports: [RouterOutlet, AppLayoutComponent, ThemeProviderComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected title = 'web';

  protected title$ = new Observable();

  protected formControl = new FormControl('');
}

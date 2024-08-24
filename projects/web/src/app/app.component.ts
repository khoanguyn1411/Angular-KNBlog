import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from '@knb/shared/layouts/app-layout/app-layout.component';
import { ThemeProviderComponent } from '@knb/shared/providers/theme-provider/theme-provider.component';

@Component({
  selector: 'knw-root',
  standalone: true,
  imports: [RouterOutlet, ThemeProviderComponent, AppLayoutComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}

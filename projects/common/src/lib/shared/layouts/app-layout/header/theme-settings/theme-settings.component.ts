import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeValue } from '@knb/core/models/theme';
import { MatRadioModule } from '@angular/material/radio';
import { ThemeService } from '@knb/core/services/ui-services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';

/** Theme settings component. */
@Component({
  selector: 'knc-theme-settings',
  standalone: true,
  templateUrl: './theme-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-settings.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, MatRadioModule],
})
export class ThemeSettingsComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly themeValues = ThemeValue.toArray();
  protected readonly currentTheme = toSignal(this.themeService.currentTheme$);

  protected toReadableTheme = ThemeValue.toReadable;
}

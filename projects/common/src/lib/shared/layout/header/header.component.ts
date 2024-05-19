import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatButtonModule} from "@angular/material/button"
import { ThemeService } from '@knb/core/services/ui-services/theme.service';

/** Header component. */
@Component({
  selector: 'knc-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.css'],
  imports: [MatButtonModule]
})
export class HeaderComponent {
  private themeService = inject(ThemeService)

  protected switchTheme(theme: string) {
    this.themeService.setTheme(theme);
  }
}

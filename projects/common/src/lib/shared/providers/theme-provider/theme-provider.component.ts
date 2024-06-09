import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeValue } from '@knb/core/models/theme';
import { ThemeService } from '@knb/core/services/ui-services/theme.service';
import { Observable, first, map, switchMap } from 'rxjs';

/** Theme provider component. */
@Component({
  selector: 'knc-theme-provider',
  standalone: true,
  templateUrl: './theme-provider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeProviderComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.initializeTheme$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected initializeTheme$(): Observable<void> {
    return this.themeService.currentThemeFromStorage$.pipe(
      first(),
      switchMap((theme) => this.themeService.setTheme(theme ?? ThemeValue.blue)),
      map(() => undefined),
    );
  }
}

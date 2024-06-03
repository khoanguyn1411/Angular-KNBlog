import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
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

  private readonly currentTheme$ = this.themeService.currentThemeFromStorage$;

  public ngOnInit(): void {
    this.initializeTheme$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected initializeTheme$(): Observable<void> {
    return this.currentTheme$.pipe(
      first(),
      switchMap((theme) =>
        this.themeService.setTheme(theme ?? ThemeValue.blue),
      ),
      map(() => undefined),
    );
  }
}

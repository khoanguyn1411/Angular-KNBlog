import { Injectable, inject } from '@angular/core';
import { ThemeValue } from '@knb/core/models/theme';
import { WINDOW_TOKEN } from '@knb/core/utils/rxjs/window-token';
import { EMPTY, Observable, defer, merge, of } from 'rxjs';
import { ThemeStorageService } from './theme-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeStorage = inject(ThemeStorageService);

  public readonly currentThemeFromStorage$ = this.themeStorage.getTheme();

  public readonly window = inject(WINDOW_TOKEN);

  public setTheme(theme: ThemeValue): Observable<void> {
    const setThemeToClassEffect$ = defer(() => {
      if (this.window == null) {
        return EMPTY;
      }
      this.window.document.body.className = '';
      this.window.document.body.classList.add(theme);
      return of(undefined);
    });
    const setThemeToLocalStorageEffect$ = this.themeStorage.setTheme(theme);
    return merge(setThemeToClassEffect$, setThemeToLocalStorageEffect$);
  }
}

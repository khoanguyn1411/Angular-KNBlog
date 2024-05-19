import { Injectable, inject } from '@angular/core';
import { ThemeValue } from '@knb/core/models/theme';
import { Observable, defer, merge, of } from 'rxjs';
import { ThemeStorageService } from './theme-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly themeStorage = inject(ThemeStorageService)

  private themeClass = 'blue-theme';

  private currentThemeFromStorage$ = this.themeStorage.getTheme()

  public setTheme(theme: ThemeValue): Observable<void> {
    const setThemeToClassEffect$ = defer(() => {
      this.themeClass = theme;
      document.body.className = '';
      document.body.classList.add(this.themeClass);
      return of(undefined)
    })
    const setThemeToLocalStorageEffect$ = this.setTheme(theme)
    return merge(setThemeToClassEffect$, setThemeToLocalStorageEffect$)
  }

  public getCurrentTheme() {
    return this.currentThemeFromStorage$;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeClass = 'blue-theme';

  public setTheme(theme: string) {
    this.themeClass = theme;
    document.body.className = '';
    document.body.classList.add(this.themeClass);
  }

  public getTheme() {
    return this.themeClass;
  }
}

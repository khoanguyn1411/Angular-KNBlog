import { Injectable, inject } from '@angular/core';
import { ThemeValue } from '@knb/core/models/theme';
import { Observable } from 'rxjs';
import { z } from 'zod';
import { constructPlainEnum } from '@knb/core/utils/construct-plain-enum';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeStorageService {
  private readonly storageService = inject(StorageService);
  private readonly THEME_STORAGE_KEY = 'theme';

  public setTheme(theme: ThemeValue): Observable<void> {
    return this.storageService.save(this.THEME_STORAGE_KEY, theme);
  }

  public getTheme(): Observable<ThemeValue | null> {
    return this.storageService.get(this.THEME_STORAGE_KEY, z.nativeEnum(constructPlainEnum(ThemeValue)));
  }
}

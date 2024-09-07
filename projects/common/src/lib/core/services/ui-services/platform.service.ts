import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  public get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

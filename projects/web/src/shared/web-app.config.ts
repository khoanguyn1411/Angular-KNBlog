import { Injectable, Provider } from '@angular/core';
import { AppConfig } from '@knb/core/services/app.config';

/** App-specific implementation of app config. */
@Injectable()
export class WebAppConfig extends AppConfig {
  /** @inheritdoc */
  public readonly apiUrl: string = import.meta.env.NG_APP_API_URL as string;

  /** @inheritdoc */
  public readonly version: string = this.getAppVersion();

  /**
   * Provides app version with optional suffix.
   */
  private getAppVersion(): string {
    return this.applySuffixIfPresent(
      this.applySuffixIfPresent(import.meta.env.NG_APP_VERSION as string, import.meta.env.NG_APP_COMMIT as string),
      import.meta.env.NG_APP_ENV as string,
    );
  }

  /**
   * Applies a provided suffix if it's present.
   * @param str Base string.
   * @param suffix Suffix.
   */
  private applySuffixIfPresent(str?: string, suffix?: string): string {
    if (str == null) {
      throw new Error(
        "Seems like NG_APP_VERSION is undefined. \
				Please make sure you've provided a correct .env file that's specific to your environment",
      );
    }
    return str.concat(suffix ? `-${suffix}` : '');
  }
}

/** Provide web app config. */
export function provideWebAppConfig(): Provider {
  return { provide: AppConfig, useClass: WebAppConfig };
}

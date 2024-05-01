import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppConfig } from '@knb/core/services/app.config';
import { provideSocialOauth } from '../shared/social-oath.config';
import { WebAppConfig } from '../shared/web-app.config';
import { provideWebAppRoutes } from '../shared/web-route-paths';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideWebAppRoutes(),
    provideSocialOauth(),
    { provide: AppConfig, useClass: WebAppConfig },
  ],
};

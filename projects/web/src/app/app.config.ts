import { ApplicationConfig, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from '@knb/core/interceptors/auth.interceptor';
import { RefreshTokenInterceptor } from '@knb/core/interceptors/refresh-token.interceptor';
import { provideQuillConfig } from 'ngx-quill';
import { QUILL_EDITOR_CONFIG } from '@knb/shared/components/editor/editor.config';
import { provideSocialOauth } from '../shared/social-oath.config';
import { provideWebAppConfig } from '../shared/web-app.config';
import { provideWebAppRoutes } from '../shared/web-route-paths';
import { routes } from './app.routes';
const httpInterceptorProviders: readonly Provider[] = [
  // The refresh interceptor should be before the auth interceptor, otherwise refreshed bearer would not be updated
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...httpInterceptorProviders,
    provideQuillConfig(QUILL_EDITOR_CONFIG),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideAnimations(),
    provideWebAppRoutes(),
    provideSocialOauth(),
    provideWebAppConfig(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
  ],
};

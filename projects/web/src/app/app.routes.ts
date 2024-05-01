import { Routes } from '@angular/router';
import { webRoutePaths } from '../shared/web-route-paths';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: webRoutePaths.root.path
  },
  {
    path: webRoutePaths.auth.path,
    loadChildren: () =>
      import('./features/authentication/auth.routes').then(r => r.AUTH_ROUTES),
  },
];

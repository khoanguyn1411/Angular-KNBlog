import { Routes } from '@angular/router';
import { routePaths } from '@knb/shared/utils/route-paths/route-paths';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: routePaths.root.path
  },
  {
    path: routePaths.auth.path,
    loadChildren: () =>
      import('./features/authentication/auth.routes').then(r => r.AUTH_ROUTES),
  },
];

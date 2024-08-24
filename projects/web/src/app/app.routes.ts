import { Routes } from '@angular/router';
import { authGuard } from '@knb/core/guards/auth-guard';
import { webRoutePaths } from '../shared/web-route-paths';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/user-views/user-views.component').then((x) => x.UserViewsComponent),
  },
  {
    path: webRoutePaths.blogs.path,
    loadChildren: () => import('./features/blogs/blogs.routes').then((r) => r.blogsRoutes),
    canMatch: [authGuard({ isAuthorized: true })],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

import { Routes } from '@angular/router';
import { webRoutePaths } from 'projects/web/src/shared/web-route-paths';

/** Users routes. */
export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./users.component').then((c) => c.UsersComponent),
    children: [
      {
        path: webRoutePaths.users.children.detail.path,
        loadComponent: () => import('./user-detail/user-detail.component').then((c) => c.UserDetailComponent),
      },
    ],
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/user-views/user-views.component').then((x) => x.UserViewsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

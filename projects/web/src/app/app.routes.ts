import { Routes } from '@angular/router';
import { webRoutePaths } from '../shared/web-route-paths';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: webRoutePaths.root.path
  },
];

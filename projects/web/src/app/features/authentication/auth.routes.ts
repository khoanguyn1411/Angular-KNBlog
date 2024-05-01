import { Routes } from '@angular/router';


import { webRoutePaths } from 'projects/web/src/shared/web-route-paths';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  { path: webRoutePaths.auth.children.login.path, component: LoginComponent },
  { path: webRoutePaths.auth.children.register.path, component: RegisterComponent },
  { path: '', pathMatch: 'full', redirectTo: webRoutePaths.auth.children.login.path },
];

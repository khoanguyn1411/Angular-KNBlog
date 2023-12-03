import { Routes } from '@angular/router';


import { routePaths } from '@knb/shared/utils/route-paths/route-paths';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  { path: routePaths.auth.children.login.path, component: LoginComponent },
  { path: routePaths.auth.children.register.path, component: RegisterComponent },
  { path: '', pathMatch: 'full', redirectTo: routePaths.auth.children.login.path },
];



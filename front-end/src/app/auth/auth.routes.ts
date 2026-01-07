import { Routes } from '@angular/router';
import { ClientLoginComponent } from './login/login.component';
import { ClientRegisterComponent } from './register/register.component';

export const authRoutes: Routes = [
  { path: 'login', component: ClientLoginComponent },
  { path: 'register', component: ClientRegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

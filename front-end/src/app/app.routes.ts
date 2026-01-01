import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'client',
    loadChildren: () =>
      import('./client/auth/auth.routes').then(m => m.authRoutes)
  },
  { path: '', redirectTo: 'client', pathMatch: 'full' }
];

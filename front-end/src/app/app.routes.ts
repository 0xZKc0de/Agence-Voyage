import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./client/client.routes').then(m => m.clientRoutes)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  { path: '', redirectTo: 'client', pathMatch: 'full' }
];
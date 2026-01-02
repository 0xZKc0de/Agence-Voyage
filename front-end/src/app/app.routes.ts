import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'client',
    loadChildren: () =>
      import('./client/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  { path: '', redirectTo: 'client', pathMatch: 'full' }
];
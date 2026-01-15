import { Routes } from '@angular/router';
import {PaymentSuccessComponent} from './client/payment-success/payment-success.component';
import {ReservationCreateComponent} from './client/reservations/reservation-create/reservation-create.component';

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
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-cancel', component: ReservationCreateComponent }];

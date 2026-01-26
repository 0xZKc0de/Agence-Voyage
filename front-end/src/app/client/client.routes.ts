import { Routes } from '@angular/router';
import { authGuard } from '../auth.guard';

export const clientRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
    children: [
      {
        path: 'website',
        loadComponent: () => import('./website/home/home.component').then(m => m.HomeComponent)
      },

      {
        path: 'circuits',
        canActivate: [authGuard],
        loadComponent: () => import('./circuits/circuits.component').then(m => m.CircuitsComponent)
      },
      {
        path: 'circuits/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./circuits/circuit-detail/circuit-detail.component').then(m => m.CircuitDetailComponent)
      },

      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },

      {
        path: 'reservations',
        canActivate: [authGuard],
        loadComponent: () => import('./reservations/reservation-list/reservation-list.component').then(m => m.ReservationListComponent)
      },
      {
        path: 'reservations/create',
        canActivate: [authGuard],
        loadComponent: () => import('./reservations/reservation-create/reservation-create.component').then(m => m.ReservationCreateComponent)
      },

      {
        path: 'payment/paypal',
        canActivate: [authGuard],
        loadComponent: () => import('./payment/paypal-payment/paypal-payment.component').then(m => m.PaypalPaymentComponent)
      },

      { path: '', redirectTo: 'website', pathMatch: 'full' }
    ]
  }
];

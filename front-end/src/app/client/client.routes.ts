import { Routes } from '@angular/router';
import { authGuard } from '../auth.guard';

export const clientRoutes: Routes = [
  {
    path: '',
    // تحميل التنسيق الرئيسي للعميل
    loadComponent: () => import('./client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
    children: [
      // 1. الصفحة الرئيسية (متاحة للجميع بدون تسجيل دخول)
      {
        path: 'website',
        loadComponent: () => import('./website/home/home.component').then(m => m.HomeComponent)
      },

      // 2. صفحات الرحلات (محمية بـ authGuard لضمان عدم رؤيتها إلا للمسجلين)
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

      // 3. صفحة الملف الشخصي (محمية)
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },

      // 4. صفحات الحجوزات (محمية)
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

      // 5. صفحة الدفع (محمية)
      {
        path: 'payment/paypal',
        canActivate: [authGuard],
        loadComponent: () => import('./payment/paypal-payment/paypal-payment.component').then(m => m.PaypalPaymentComponent)
      },

      // توجيه تلقائي في حال كان الرابط فارغاً
      { path: '', redirectTo: 'website', pathMatch: 'full' }
    ]
  }
];

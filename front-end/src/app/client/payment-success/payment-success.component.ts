import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaypalService } from '../../services/paypal.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  isLoading = true;
  success = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paypalService: PaypalService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // 1. الحصول على رمز الدفع من باي بال
      const orderId = params['token'];

      // 2. محاولة الحصول على رقم الحجز (إما من الرابط أو من الذاكرة المؤقتة)
      let reservationId = params['resId'];

      if (!reservationId) {
        // إذا لم يكن في الرابط، نحاول جلبه من الذاكرة (الذي حفظناه في الخطوة السابقة)
        reservationId = localStorage.getItem('currentReservationId');
      }

      if (orderId && reservationId) {
        this.validatePayment(orderId, Number(reservationId));
      } else {
        this.isLoading = false;
        this.success = false;
        this.errorMessage = "عذراً، بيانات الدفع مفقودة (رقم الحجز أو التوكن غير موجود).";
        console.error('Missing params. Token:', orderId, 'ResId:', reservationId);
      }
    });
  }

  validatePayment(orderId: string, reservationId: number) {
    this.paypalService.capturePayment(orderId, reservationId).subscribe({
      next: (response) => {
        console.log('Payment Captured:', response);
        this.success = true;
        this.isLoading = false;
        // تنظيف الذاكرة بعد النجاح
        localStorage.removeItem('currentReservationId');
      },
      error: (err) => {
        console.error('Capture error:', err);
        this.success = false;
        this.isLoading = false;
        this.errorMessage = "فشل تأكيد الدفع مع النظام. يرجى الاتصال بالدعم.";
      }
    });
  }

  goToReservations() {
    // يمكنك تغيير الرابط حسب ما يناسب تطبيقك
    this.router.navigate(['/']);
  }
}

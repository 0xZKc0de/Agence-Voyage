import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // استيراد مهم
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
    private paypalService: PaypalService,
    @Inject(PLATFORM_ID) private platformId: Object // حقن معرف المنصة لمعرفة هل نحن في المتصفح أم السيرفر
  ) {}

  ngOnInit() {
    // التحقق من أننا داخل المتصفح قبل تنفيذ الكود
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe(params => {
        const orderId = params['token'];
        let reservationId = params['resId'];

        if (!reservationId) {
          // استخدام localStorage فقط إذا كنا في المتصفح (وهو مضمون بفضل الشرط الخارجي)
          reservationId = localStorage.getItem('currentReservationId');
        }

        if (orderId && reservationId) {
          this.validatePayment(orderId, Number(reservationId));
        } else {
          this.isLoading = false;
          this.success = false;
          this.errorMessage = "عذراً، بيانات الدفع مفقودة.";
        }
      });
    }
  }

  validatePayment(orderId: string, reservationId: number) {
    this.paypalService.capturePayment(orderId, reservationId).subscribe({
      next: (response) => {
        console.log('Payment Captured:', response);
        this.success = true;
        this.isLoading = false;

        // التحقق مرة أخرى قبل الحذف لتجنب الخطأ
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentReservationId');
        }
      },
      error: (err) => {
        console.error('Capture error:', err);
        this.success = false;
        this.isLoading = false;
        this.errorMessage = "حدث خطأ أثناء تأكيد الدفع.";
      }
    });
  }

  goToReservations() {
    this.router.navigate(['/client/reservations']);
  }
}

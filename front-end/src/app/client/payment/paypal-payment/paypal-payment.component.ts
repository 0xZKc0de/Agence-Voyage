import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PaypalService } from '../../../services/paypal.service';

@Component({
  selector: 'app-paypal-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.css']
})
export class PaypalPaymentComponent implements OnInit {
  paymentDetails: any = null;
  isLoading = true;
  isProcessing = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paypalService: PaypalService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['reservationId']) {
        this.paymentDetails = {
          reservationId: +params['reservationId'],
          amount: +params['amount'],
          clientEmail: params['clientEmail']
        };
        this.isLoading = false;
      } else {
        this.router.navigate(['/client/reservations']);
      }
    });
  }

  payWithPaypal() {
    this.isProcessing = true;

    this.paypalService.createPayment(this.paymentDetails.reservationId).subscribe({
      next: (approvalUrl) => {
        console.log('Redirecting to:', approvalUrl);
        window.location.href = approvalUrl;
      },
      error: (err) => {
        console.error('Error creating payment:', err);
        this.isProcessing = false;
        alert('Une erreur est survenue lors de l\'initialisation du paiement.');
      }
    });
  }

  cancelPayment() {
    this.router.navigate(['/client/reservations']);
  }
}

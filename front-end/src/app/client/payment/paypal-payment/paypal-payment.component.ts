import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PaymentDetails {
  reservationId: number;
  amount: number;
  description: string;
  clientEmail: string;
}

@Component({
  selector: 'app-paypal-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.css']
})
export class PaypalPaymentComponent implements OnInit, AfterViewInit {
  paymentDetails: PaymentDetails | null = null;
  isLoading = true;
  isProcessing = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Récupérer les détails de la réservation
    this.route.queryParams.subscribe(params => {
      this.paymentDetails = {
        reservationId: +params['reservationId'] || 1,
        amount: +params['amount'] || 0,
        description: `Réservation #${params['reservationId'] || '1'}`,
        clientEmail: params['clientEmail'] || 'client@example.com' // À remplacer par l'email réel
      };
      this.isLoading = false;
    });
  }

  ngAfterViewInit() {
    // Initialiser PayPal Button (si utilisé)
    this.loadPayPalScript();
  }

  loadPayPalScript() {
    // À implémenter: Charger le SDK PayPal
    // Exemple:
    // const script = document.createElement('script');
    // script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=EUR';
    // document.head.appendChild(script);
  }

  simulatePayment() {
    this.isProcessing = true;
    
    // Simuler un paiement réussi
    setTimeout(() => {
      this.isProcessing = false;
      
      // Rediriger vers la page de statut
      this.router.navigate(['/client/reservations']);
    }, 2000);
  }

  cancelPayment() {
    if (confirm('Êtes-vous sûr de vouloir annuler le paiement ?')) {
      this.router.navigate(['/client/reservations']);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CircuitService } from '../../../services/circuit.service';
import { ReservationService } from '../../../services/reservation.service';
import { PaypalService } from '../../../services/paypal.service';

@Component({
  selector: 'app-reservation-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.css']
})
export class ReservationCreateComponent implements OnInit {
  reservationForm: FormGroup;
  circuits: any[] = [];
  selectedCircuit: any | null = null;
  isLoading = true;
  isSubmitting = false;
  isPreSelected = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private circuitService: CircuitService,
    private reservationService: ReservationService,
    private paypalService: PaypalService
  ) {
    this.reservationForm = this.fb.group({
      circuitId: ['', Validators.required],
      participants: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadCircuits();
  }

  loadCircuits() {
    this.isLoading = true;
    this.circuitService.getCircuits().subscribe({
      next: (data) => {
        console.log('✅ Circuits chargés:', data);
        this.circuits = data;
        this.isLoading = false;
        this.checkUrlParams();
      },
      error: (err) => {
        console.error('❌ Erreur chargement circuits:', err);
        this.isLoading = false;
      }
    });
  }

  checkUrlParams() {
    const circuitIdFromUrl = this.route.snapshot.queryParamMap.get('circuitId');
    if (circuitIdFromUrl && this.circuits.length > 0) {
      const id = Number(circuitIdFromUrl);
      const found = this.circuits.find(c => c.id === id);
      if (found) {
        this.isPreSelected = true;
        this.selectedCircuit = found;
        this.reservationForm.patchValue({ circuitId: id });
        this.onCircuitChange(id);
        this.reservationForm.get('circuitId')?.disable();
      }
    }
  }

  onCircuitChange(val: any) {
    const id = Number(val);
    this.selectedCircuit = this.circuits.find(c => c.id === id);
    if (this.selectedCircuit) {
      const places = this.selectedCircuit.placesRestantes || this.selectedCircuit.nb_places || 50;
      this.reservationForm.get('participants')?.setValidators([
        Validators.required, Validators.min(1), Validators.max(places)
      ]);
      this.reservationForm.get('participants')?.updateValueAndValidity();
    }
  }

  calculateTotal(): number {
    if (!this.selectedCircuit) return 0;
    const count = this.reservationForm.get('participants')?.value || 0;
    return this.selectedCircuit.prix * count;
  }

  cancel() {
    this.router.navigate(['/client/circuits']);
  }

  onSubmit() {
    if (this.reservationForm.invalid) return;
    this.isSubmitting = true;

    const formVal = this.reservationForm.getRawValue();
    const request = {
      circuitId: Number(formVal.circuitId),
      nbPersons: Number(formVal.participants)
    };

    // 1. إنشاء الحجز
    this.reservationService.initiateReservation(request).subscribe({
      next: (res: any) => {
        console.log('✅ Réservation créée avec succès. ID:', res.id);

        // 🔥🔥🔥 حفظ رقم الحجز في الذاكرة (هذا هو الحل) 🔥🔥🔥
        localStorage.setItem('currentReservationId', res.id.toString());

        // 2. طلب رابط الدفع
        this.paypalService.createPayment(res.id).subscribe({
          next: (link) => {
            // التوجيه إلى PayPal
            window.location.href = link;
          },
          error: (e) => {
            console.error("Erreur PayPal:", e);
            alert("Impossible de connecter à PayPal.");
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        console.error("Erreur Réservation:", err);
        this.isSubmitting = false;
        alert("Une erreur est survenue lors de la réservation.");
      }
    });
  }
}

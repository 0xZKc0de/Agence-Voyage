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
  // نستخدم any هنا لنقبل أي اسم يرسله الباك إند (distination أو destination)
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
        console.log('✅ تم تحميل الرحلات:', data);
        this.circuits = data;
        this.isLoading = false;

        // استدعاء دالة التحقق من الرابط فور وصول البيانات
        this.checkUrlParams();
      },
      error: (err) => {
        console.error('❌ خطأ في تحميل الرحلات:', err);
        this.isLoading = false;
      }
    });
  }

  checkUrlParams() {
    // جلب الـ ID من الرابط (مثلاً: ?circuitId=8)
    const circuitIdFromUrl = this.route.snapshot.queryParamMap.get('circuitId');

    if (circuitIdFromUrl && this.circuits.length > 0) {
      const id = Number(circuitIdFromUrl);
      const found = this.circuits.find(c => c.id === id);

      if (found) {
        console.log('✅ تم العثور على الرحلة المطلوبة:', found);
        this.isPreSelected = true;
        this.selectedCircuit = found; // تحديد الرحلة للمتغير

        // تحديث الفورم
        this.reservationForm.patchValue({ circuitId: id });

        // تفعيل تحديث السعر والعدد
        this.onCircuitChange(id);

        // قفل القائمة المنسدلة
        this.reservationForm.get('circuitId')?.disable();
      } else {
        console.warn('⚠️ الـ ID الموجود في الرابط غير موجود في القائمة');
      }
    }
  }

  // دالة الإلغاء التي كانت ناقصة وتسبب الخطأ
  cancel() {
    // العودة إلى صفحة الرحلات
    this.router.navigate(['/client/circuits']);
  }

  onCircuitChange(val: any) {
    const id = Number(val);
    this.selectedCircuit = this.circuits.find(c => c.id === id);

    if (this.selectedCircuit) {
      // التعامل مع اختلاف التسميات (nb_places أو placesRestantes)
      const places = this.selectedCircuit.placesRestantes || this.selectedCircuit.nb_places || 50;

      this.reservationForm.get('participants')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(places)
      ]);
      this.reservationForm.get('participants')?.updateValueAndValidity();
    }
  }

  calculateTotal(): number {
    if (!this.selectedCircuit) return 0;
    const count = this.reservationForm.get('participants')?.value || 0;
    return this.selectedCircuit.prix * count;
  }

  onSubmit() {
    if (this.reservationForm.invalid) return;
    this.isSubmitting = true;

    // getRawValue مهمة جداً لأن حقل circuitId قد يكون disabled
    const formVal = this.reservationForm.getRawValue();

    const request = {
      circuitId: Number(formVal.circuitId),
      nbPersons: Number(formVal.participants)
    };

    this.reservationService.initiateReservation(request).subscribe({
      next: (res: any) => {
        console.log('تم الحجز، جاري الدفع...', res);
        this.paypalService.createPayment(res.id).subscribe({
          next: (link) => window.location.href = link,
          error: (e) => {
            alert("فشل في الاتصال بـ PayPal");
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert("فشل إنشاء الحجز");
      }
    });
  }
}

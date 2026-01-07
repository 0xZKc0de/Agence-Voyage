import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// تعريف بنية البيانات للرحلة
interface Circuit {
  id: number;
  distination: string;
  dateDepart: string;
  dateArrive: string;
  prix: number;
  description: string;
  imageUrl: string;
  nb_places: number;
}

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circuit-detail.component.html',
  styleUrls: ['./circuit-detail.component.css']
})
export class CircuitDetailComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  circuit: Circuit | null = null;
  isLoading = true;
  participants = 1;
  showReservationForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // الحصول على معرف الرحلة من الرابط
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadCircuit(id);
    });
  }

  // جلب بيانات الرحلة من الـ Backend
  loadCircuit(id: number) {
    this.isLoading = true;
    this.http.get<Circuit>(`http://localhost:8080/api/v1/circuits/get/${id}`)
      .subscribe({
        next: (data) => {
          this.circuit = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement:', err);
          this.isLoading = false;
        }
      });
  }

  // حساب مدة الرحلة بالأيام
  getDuration(): number {
    if (!this.circuit) return 0;
    const start = new Date(this.circuit.dateDepart);
    const end = new Date(this.circuit.dateArrive);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // حساب السعر الإجمالي
  calculateTotal(): number {
    return (this.circuit?.prix || 0) * this.participants;
  }

  toggleReservation() {
    this.showReservationForm = !this.showReservationForm;
  }

  closeDetail() {
    this.close.emit();
    this.router.navigate(['/client/circuits']);
  }

  // دالة لزيادة عدد المشاركين (مع التأكد من عدم تجاوز الأماكن المتاحة)
  increment() {
    if (this.participants < (this.circuit?.nb_places || 1)) {
      this.participants++;
    }
  }

  // دالة لتقليل عدد المشاركين (بحد أدنى 1)
  decrement() {
    if (this.participants > 1) {
      this.participants--;
    }
  }

  // دالة الحجز والانتقال لصفحة الدفع أو إكمال البيانات
  reserveCircuit() {
    // التأكد من أن العدد لا يتجاوز nb_places المعرف في الـ Interface
    if (this.circuit && this.participants <= this.circuit.nb_places) {
      this.router.navigate(['/client/reservations/create'], {
        queryParams: {
          circuitId: this.circuit.id,
          participants: this.participants,
          prix: this.circuit.prix,
          total: this.calculateTotal()
        }
      });
    }
  }
}

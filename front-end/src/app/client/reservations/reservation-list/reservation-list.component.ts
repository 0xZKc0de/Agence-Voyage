import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../services/reservation.service';

// تعريف الواجهة بناءً على كلاس Java Reservation
// تأكدنا هنا أن الحقول تطابق ما يرسله الباك-إند (JSON)
export interface Reservation {
  id: number;
  date: string; // أو dateReservation حسب التسمية في JSON
  nbPersons: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; // الحالة كما هي في قاعدة البيانات
  prixTotal?: number; // إذا كان الباك إند يحسبه ويرسله

  // العلاقات المتداخلة (Nested Objects)
  circuit?: {
    id: number;
    destination: string; // انتبه: قد تكون distination حسب الخطأ الإملائي في الباك إند
    distination?: string;
    nom?: string;
    prix: number;
  };
  client?: {
    nom: string;
    email: string;
  };
  payment?: {
    status: string;
  };
}

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter = '';

  // إحصائيات
  totalReservations = 0;
  pendingReservations = 0;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.reservationService.getMyReservations().subscribe({
      next: (data: any[]) => {
        console.log('Reservations loaded:', data); // للفحص
        this.reservations = data;
        this.filteredReservations = data;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.isLoading = false;
      }
    });
  }

  // --- دالة الإلغاء ---
  cancelReservation(reservation: Reservation) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    // استدعاء السيرفس
    this.reservationService.cancelReservation(reservation.id).subscribe({
      next: (updatedRes) => {
        // تحديث الحالة محلياً لكي يرى المستخدم التغيير فوراً
        reservation.status = 'CANCELLED';

        // إعادة حساب الإحصائيات وتطبيق الفلتر
        this.calculateStats();
        alert('La réservation a été annulée avec succès.');
      },
      error: (err) => {
        console.error('Cancellation error:', err);
        alert("Erreur: Impossible d'annuler cette réservation.");
      }
    });
  }

  // --- دالة الدفع ---
  processPayment(reservation: Reservation) {
    // نستخدم ID الحجز لإنشاء رابط الدفع في PayPal
    // يمكننا توجيه المستخدم لصفحة وسيطة أو استدعاء الدفع مباشرة
    this.router.navigate(['/client/payment-success'], {
      queryParams: { resId: reservation.id }
      // ملاحظة: هنا نفترض أنك تريد إعادة محاولة الدفع
      // الأفضل عادة هو إعادة توجيهه لصفحة تنشئ رابط PayPal جديد
    });

    // أو إذا كان لديك صفحة تفاصيل تعرض زر الدفع:
    // this.router.navigate(['/client/reservations', reservation.id]);
  }


  filterReservations() {
    this.filteredReservations = this.reservations.filter(res => {
      const destination = res.circuit?.destination || res.circuit?.distination || '';

      const matchesSearch = !this.searchTerm ||
        destination.toLowerCase().includes(this.searchTerm.toLowerCase());

      // البحث بالحالة
      const matchesStatus = !this.statusFilter ||
        res.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredReservations = [...this.reservations];
  }

  calculateStats() {
    this.totalReservations = this.reservations.length;
    this.pendingReservations = this.reservations.filter(r => r.status === 'PENDING').length;
  }

  // تحويل الحالة الإنجليزية (DB) إلى فرنسية (UI)
  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmée';
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-default';
    }
  }

  calculatePrice(res: Reservation): number {
    if (res.prixTotal) return res.prixTotal;
    if (res.circuit && res.circuit.prix) {
      return res.circuit.prix * res.nbPersons;
    }
    return 0;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// استيراد الخدمة ضروري جداً
import { ReservationService } from '../../../services/reservation.service';

interface Reservation {
  id: number;
  dateReservation: string;
  dateDepart: string;
  participants: number;
  clientNom: string;
  clientEmail: string;
  circuitNom: string;
  circuitDestination: string;
  prixTotal: number;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
  paiementStatut?: 'EN_ATTENTE' | 'PAYE' | 'REFUSE';
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

  // Propriétés pour les statistiques
  totalReservations = 0;
  confirmedReservations = 0;
  pendingReservations = 0;
  totalSpent = 0;

  constructor(
    private reservationService: ReservationService, // ✅ تم حقن الخدمة هنا
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;

    // ✅ استخدام الدالة الجديدة التي تجلب حجوزات العميل الحالي فقط
    this.reservationService.getMyReservations().subscribe({
      next: (data: any[]) => {
        // تحويل البيانات القادمة من الباك إند لتناسب الواجهة
        this.reservations = data.map(res => ({
          ...res,
          // التأكد من وجود البيانات الفرعية لتجنب الأخطاء
          circuitDestination: res.circuit?.distination || 'Inconnue',
          circuitNom: res.circuit?.description || '',
          clientEmail: res.client?.email || '',
          clientNom: res.client ? `${res.client.firstName} ${res.client.lastName}` : 'Moi'
        }));

        this.filteredReservations = [...this.reservations];

        // ✅ تحديث الإحصائيات بعد جلب البيانات
        this.calculateStats();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement réservations:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.totalReservations = this.reservations.length;
    this.confirmedReservations = this.reservations.filter(r => r.statut === 'CONFIRMEE').length;
    this.pendingReservations = this.reservations.filter(r => r.statut === 'EN_ATTENTE').length;

    // حساب المبلغ الإجمالي للحجوزات المؤكدة فقط
    this.totalSpent = this.reservations
      .filter(r => r.statut === 'CONFIRMEE')
      .reduce((total, res) => total + (res.prixTotal || 0), 0);
  }

  filterReservations() {
    let filtered = this.reservations;

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(res =>
        (res.clientNom && res.clientNom.toLowerCase().includes(search)) ||
        (res.clientEmail && res.clientEmail.toLowerCase().includes(search)) ||
        (res.circuitNom && res.circuitNom.toLowerCase().includes(search)) ||
        (res.circuitDestination && res.circuitDestination.toLowerCase().includes(search))
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(res => res.statut === this.statusFilter);
    }

    this.filteredReservations = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filterReservations();
  }

  viewReservation(reservation: Reservation) {
    // التوجيه لصفحة التفاصيل (تأكد أن هذا المسار موجود في الـ Routing)
    this.router.navigate(['/client/reservations', reservation.id]);
  }

  cancelReservation(reservation: Reservation) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.cancelReservation(reservation.id).subscribe({
        next: () => {
          // تحديث الحالة محلياً
          reservation.statut = 'ANNULEE';
          this.calculateStats(); // تحديث الإحصائيات
        },
        error: (err) => console.error('Erreur annulation', err)
      });
    }
  }

  processPayment(reservation: Reservation) {
    this.router.navigate(['/client/payment/paypal'], {
      queryParams: {
        clientEmail : reservation.clientEmail,
        reservationId: reservation.id,
        amount: reservation.prixTotal
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMEE': return 'badge-success';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'ANNULEE': return 'badge-error';
      default: return 'badge-default';
    }
  }

  getPaymentBadgeClass(status: string): string {
    switch (status) {
      case 'PAYE': return 'badge-success';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'REFUSE': return 'badge-error';
      default: return 'badge-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      default: return status;
    }
  }

  getPaymentText(status: string): string {
    switch (status) {
      case 'PAYE': return 'Payé';
      case 'EN_ATTENTE': return 'En attente';
      case 'REFUSE': return 'Refusé';
      default: return status;
    }
  }
}

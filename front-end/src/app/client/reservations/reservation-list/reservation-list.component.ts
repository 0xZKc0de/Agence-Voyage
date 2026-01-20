import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../services/reservation.service';

export interface Reservation {
  id: number;
  date: string;
  nbPersons: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  prixTotal?: number;
  circuit?: {
    id: number;
    destination: string; // التعامل مع الخطأ الإملائي المحتمل في الباك إند
    distination?: string;
    prix: number;
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

  // Search & Filter
  searchTerm: string = '';
  statusFilter: string = ''; // '' = All

  // Stats
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
        this.reservations = data;
        this.calculateStats();
        this.filterReservations(); // Apply initial filters
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement réservations', err);
        this.isLoading = false;
      }
    });
  }

  // دالة جديدة لتفعيل التبويبات
  setFilter(status: string) {
    this.statusFilter = status;
    this.filterReservations();
  }

  filterReservations() {
    this.filteredReservations = this.reservations.filter(res => {
      // 1. Search Logic
      const dest = res.circuit?.destination || res.circuit?.distination || '';
      const matchesSearch = !this.searchTerm ||
        dest.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        res.id.toString().includes(this.searchTerm);

      // 2. Status Logic
      const matchesStatus = !this.statusFilter || res.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.setFilter('');
  }

  calculateStats() {
    this.totalReservations = this.reservations.length;
    this.pendingReservations = this.reservations.filter(r => r.status === 'PENDING').length;
  }

  // Helpers UI
  calculatePrice(res: Reservation): number {
    if (res.prixTotal) return res.prixTotal;
    const pricePerPerson = res.circuit?.prix || 0;
    return pricePerPerson * res.nbPersons;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAID': return 'Confirmée';
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-default';
    }
  }

  // Actions
  cancelReservation(res: Reservation) {
    if(confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.cancelReservation(res.id).subscribe(() => {
        this.loadReservations(); // Refresh list
      });
    }
  }

  processPayment(res: Reservation) {
    // Logic for payment (TBD)
    console.log('Processing payment for', res.id);
  }
}

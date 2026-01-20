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
    destination: string;
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

  searchTerm: string = '';
  statusFilter: string = '';

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
    this.reservationService.getAllReservations().subscribe({
      next: (data: any) => {
        this.reservations = data;
        this.applyFilters();
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredReservations = this.reservations.filter(res => {
      const destination = res.circuit?.destination || res.circuit?.distination || '';
      const matchesSearch = destination.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || res.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  setFilter(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.setFilter('');
  }

  calculateStats() {
    this.totalReservations = this.reservations.length;
    this.pendingReservations = this.reservations.filter(r => r.status === 'PENDING').length;
  }

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

  cancelReservation(res: Reservation) {
    if(confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.cancelReservation(res.id).subscribe({
        next: () => {
          res.status = 'CANCELLED';
          this.calculateStats();
        },
        error: (err) => console.error(err)
      });
    }
  }

  processPayment(res: Reservation) {
    if (res.circuit && res.circuit.id) {
      this.router.navigate(['/client/reservations/create'], {
        queryParams: {
          circuitId: res.circuit.id,
          participants: 1
        }
      });
    } else {
      console.error('Erreur: Impossible de trouver le circuit associé à cette réservation');
    }
  }
}

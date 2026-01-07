import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    setTimeout(() => {
      this.reservations = [
        {
          id: 1,
          dateReservation: '2024-01-15',
          dateDepart: '2024-03-15',
          participants: 2,
          clientNom: 'Mariam Chairi',
          clientEmail: 'mariam.chairi@email.com',
          circuitNom: 'Marrakech Impériale',
          circuitDestination: 'Marrakech',
          prixTotal: 5998,
          statut: 'CONFIRMEE',
          paiementStatut: 'PAYE'
        },
        {
          id: 2,
          dateReservation: '2024-01-20',
          dateDepart: '2024-04-10',
          participants: 1,
          clientNom: 'Mariam Chairi',
          clientEmail: 'mariam.chairi@email.com',
          circuitNom: 'Sahara Aventure',
          circuitDestination: 'Merzouga',
          prixTotal: 1899,
          statut: 'EN_ATTENTE',
          paiementStatut: 'EN_ATTENTE'
        },
        {
          id: 3,
          dateReservation: '2024-01-25',
          dateDepart: '2024-05-20',
          participants: 4,
          clientNom: 'Mariam Chairi',
          clientEmail: 'mariam.chairi@email.com',
          circuitNom: 'Côte Atlantique',
          circuitDestination: 'Essaouira',
          prixTotal: 6396,
          statut: 'CONFIRMEE',
          paiementStatut: 'PAYE'
        },
        {
          id: 4,
          dateReservation: '2024-02-01',
          dateDepart: '2024-06-05',
          participants: 3,
          clientNom: 'Mariam Chairi',
          clientEmail: 'mariam.chairi@email.com',
          circuitNom: 'Montagnes de l\'Atlas',
          circuitDestination: 'Toubkal',
          prixTotal: 7497,
          statut: 'ANNULEE',
          paiementStatut: 'REFUSE'
        }
      ];
      this.filteredReservations = this.reservations;
      this.isLoading = false;
      
      this.calculateStats();
    }, 800);
  }

  calculateStats() {
    this.totalReservations = this.reservations.length;
    this.confirmedReservations = this.reservations.filter(r => r.statut === 'CONFIRMEE').length;
    this.pendingReservations = this.reservations.filter(r => r.statut === 'EN_ATTENTE').length;
    this.totalSpent = this.reservations
      .filter(r => r.statut === 'CONFIRMEE')
      .reduce((total, res) => total + res.prixTotal, 0);
  }

  filterReservations() {
    let filtered = this.reservations;

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(res =>
        res.clientNom.toLowerCase().includes(search) ||
        res.clientEmail.toLowerCase().includes(search) ||
        res.circuitNom.toLowerCase().includes(search) ||
        res.circuitDestination.toLowerCase().includes(search)
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
    this.router.navigate(['/client/reservations', reservation.id]);
  }

  cancelReservation(reservation: Reservation) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      console.log('Annulation réservation:', reservation.id);
    }
  }

  // MÉTHODE MANQUANTE - À AJOUTER
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
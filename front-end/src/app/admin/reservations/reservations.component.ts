import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  searchTerm = '';
  reservations: any[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data.map(r => ({
          id: r.id,
          date: r.dateReservation,
          personnes: r.nbPersons,
          client: r.client.firstName + ' ' + r.client.lastName,
          circuit: r.circuit.name,
          statut: this.mapStatus(r.status)
        }));
      },
      error: (err) => {
        console.error('Error loading reservations', err);
      }
    });
  }

  mapStatus(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulée';
      case 'PAID': return 'Confirmée';
      default: return status;
    }
  }

  get filteredReservations() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) return this.reservations;

    return this.reservations.filter(r =>
      r.id.toString().includes(term) ||
      r.client.toLowerCase().includes(term) ||
      r.circuit.toLowerCase().includes(term) ||
      r.statut.toLowerCase().includes(term)
    );
  }
}

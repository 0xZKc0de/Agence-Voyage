import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {

  searchTerm = '';

  reservations = [
    {
      id: 1,
      date: '2026-01-15',
      personnes: 3,
      client: 'Ahmed Benali',
      circuit: 'Circuit du Désert',
      statut: 'Confirmée'
    },
    {
      id: 2,
      date: '2026-02-02',
      personnes: 2,
      client: 'Sarah Amrani',
      circuit: 'Circuit Atlas',
      statut: 'En attente'
    },
    {
      id: 3,
      date: '2026-03-10',
      personnes: 5,
      client: 'Youssef El Idrissi',
      circuit: 'Circuit Nord',
      statut: 'Annulée'
    }
  ];

  get filteredReservations() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      return this.reservations;
    }

    return this.reservations.filter(r =>
      r.id.toString().includes(term) ||
      r.client.toLowerCase().includes(term) ||
      r.circuit.toLowerCase().includes(term) ||
      r.statut.toLowerCase().includes(term)
    );
  }
}

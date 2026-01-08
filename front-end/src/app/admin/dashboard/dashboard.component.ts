import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  clientsCount = 0;
  reservationsCount = 0;

  constructor(
    private clientService: ClientService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadClientsCount();
    this.loadReservationsCount();
  }

  loadClientsCount() {
    this.clientService.getClientsCount().subscribe({
      next: count => this.clientsCount = count,
      error: err => console.error('Error loading clients count', err)
    });
  }

  loadReservationsCount() {
    this.reservationService.getReservationsCount().subscribe({
      next: count => this.reservationsCount = count,
      error: err => console.error('Error loading reservations count', err)
    });
  }
}

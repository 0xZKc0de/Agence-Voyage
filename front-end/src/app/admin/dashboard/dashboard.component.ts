import { Component, OnInit } from '@angular/core';
import { ClientService, ClientData } from '../../services/client.service';
import { ReservationService } from '../../services/reservation.service';
import { CircuitService } from '../../services/circuit.service';
import { DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, DecimalPipe]
})
export class DashboardComponent implements OnInit {

  clientsCount = 0;
  reservationsCount = 0;
  circuitsCount = 0;
  revenue = 0;

  topClients: ClientData[] = []; // use ClientData directly

  constructor(
    private clientService: ClientService,
    private reservationService: ReservationService,
    private circuitService: CircuitService
  ) {}

  ngOnInit(): void {
    this.loadClientsCount();
    this.loadReservationsCount();
    this.loadCircuitsCount();
    this.loadRevenue();
    this.loadTopClients();
  }

  loadTopClients() {
    this.clientService.getTopClients(5).subscribe({
      next: (clients: ClientData[]) => {
        // Ensure totalAmount is always a number (not undefined)
        this.topClients = clients.map(c => ({
          ...c,
          totalAmount: c.totalAmount ?? 0
        }));
      },
      error: (err: any) => console.error('Error loading top clients', err)
    });
  }

  loadRevenue() {
    this.reservationService.getTotalRevenue().subscribe({
      next: (amount: number) => this.revenue = amount,
      error: (err: any) => console.error('Error loading revenue', err)
    });
  }

  loadCircuitsCount() {
    this.circuitService.getCircuitsCount().subscribe({
      next: count => this.circuitsCount = count,
      error: err => console.error('Error loading circuits count', err)
    });
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

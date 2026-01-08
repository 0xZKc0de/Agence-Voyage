import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy {

  searchTerm = '';
  reservations: any[] = [];
  isLoading = false;
  errorMessage = '';
  totalReservations = 0;

  private routerSub!: Subscription;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initial load
    this.loadReservations();

    // Reload every time we navigate to this route
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation ended, reloading reservations...');
        this.loadReservations();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  loadReservations() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.isLoading = false;

        if (!data || data.length === 0) {
          this.reservations = [];
          this.totalReservations = 0;
          return;
        }

        this.reservations = data.map(r => {
          const clientName = r.client ? 
            `${r.client.firstName || ''} ${r.client.lastName || ''}`.trim() : 
            'Inconnu';
          
          const circuitName = r.circuit ? 
            (r.circuit.distination || r.circuit.destination || r.circuit.name || 'Inconnu') : 
            'Inconnu';

          return {
            id: r.id || 0,
            date: r.date ? new Date(r.date).toLocaleDateString('fr-FR') : 'N/A',
            personnes: r.nbPersons || r.personnes || r.nbPersonnes || 0,
            client: clientName,
            circuit: circuitName,
            statut: this.mapStatus(r.status || 'PENDING'),
            _raw: r
          };
        });

        // Update total reservations
        this.totalReservations = this.reservations.length;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.isLoading = false;
        this.errorMessage = 'Échec du chargement des réservations. Veuillez réessayer.';
        this.reservations = [];
        this.totalReservations = 0;
      }
    });
  }

  mapStatus(status: string): string {
    if (!status) return 'Inconnu';
    
    switch (status.toUpperCase()) {
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulée';
      case 'PAID':
      case 'CONFIRMED': return 'Confirmée';
      default: return status;
    }
  }

  get filteredReservations() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.reservations;

    return this.reservations.filter(r =>
      (r.id?.toString() || '').includes(term) ||
      (r.client || '').toLowerCase().includes(term) ||
      (r.circuit || '').toLowerCase().includes(term) ||
      (r.statut || '').toLowerCase().includes(term) ||
      (r.date || '').toLowerCase().includes(term)
    );
  }

  // Optional: manual refresh
  refreshReservations() {
    this.loadReservations();
  }

  // Optional: format date better
  formatDate(dateString: string): string {
    if (!dateString || dateString === 'N/A') return dateString;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
}

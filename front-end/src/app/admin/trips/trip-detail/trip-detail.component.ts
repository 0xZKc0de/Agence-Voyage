// trips/trip-detail/trip-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CircuitService } from '../../../services/circuit.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TripDetailComponent implements OnInit, OnDestroy {
  trip: any = null;
  loading = true;
  private routeSub!: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private circuitService: CircuitService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('Route ID received:', id); // Debug log
      if (id) {
        this.loadTrip(parseInt(id));
      } else {
        this.closeSidebar();
      }
    });
  }

  loadTrip(id: number): void {
    this.loading = true;
    this.circuitService.getCircuitById(id).subscribe({
      next: (circuit) => {
        console.log('Circuit loaded from backend:', circuit); // Debug log
        this.mapCircuitToTrip(circuit);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading trip:', err);
        this.loading = false;
        alert('Erreur lors du chargement du circuit');
        this.closeSidebar();
      }
    });
  }

  mapCircuitToTrip(circuit: any): void {
    // Calculate duration in days
    let duration = 0;
    if (circuit.dateDepart && circuit.dateArrive) {
      const start = new Date(circuit.dateDepart);
      const end = new Date(circuit.dateArrive);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    this.trip = {
      id: circuit.id,
      nom: circuit.distination || 'Circuit sans nom',
      destination: circuit.distination || '',
      description: circuit.description || 'Aucune description',
      duree: duration,
      prix: circuit.prix || 0,
      imageUrl: circuit.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
      placesTotal: circuit.nb_places || 0,
      placesRestantes: circuit.nb_places || 0,
      active: true,
      dateDepart: circuit.dateDepart ? new Date(circuit.dateDepart) : new Date(),
      dateArrive: circuit.dateArrive ? new Date(circuit.dateArrive) : null
    };
    
    console.log('Mapped trip for display:', this.trip); // Debug log
  }

  editTrip(): void {
    if (this.trip?.id) {
      this.router.navigate(['/admin/trips/edit', this.trip.id]);
    }
  }

  deleteTrip(): void {
    if (this.trip?.id && confirm('Êtes-vous sûr de vouloir supprimer ce circuit ?')) {
      // You'll need to add delete method to CircuitService
      // For now, let's just show an alert
      alert('Fonction de suppression à implémenter dans CircuitService');
      this.closeSidebar();
    }
  }

  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CircuitService } from '../../../services/circuit.service';
import { CommonModule } from '@angular/common';
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
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
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
        this.mapCircuitToTrip(circuit);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading trip:', err);
        this.loading = false;
        alert('Erreur lors du chargement du circuit');
        this.closeSidebar();
      }
    });
  }

  mapCircuitToTrip(circuit: any): void {
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
  }

  editTrip(): void {
    if (this.trip?.id) {
      this.router.navigate(['/admin/trips/edit', this.trip.id]);
    }
  }

  deleteTrip(): void {
    if (this.trip?.id && confirm('Êtes-vous sûr de vouloir supprimer ce circuit ?')) {
      this.circuitService.deleteCircuit(this.trip.id).subscribe({
        next: () => {
          alert('Circuit supprimé avec succès');
          this.closeSidebar();
          // يمكنك إضافة تحديث للصفحة الرئيسية هنا إذا لزم الأمر
          // window.location.reload();
        },
        error: (err: any) => {
          console.error('Erreur suppression:', err);
          alert("Erreur lors de la suppression du circuit.");
        }
      });
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

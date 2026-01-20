import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CircuitService } from '../../services/circuit.service';

interface Trip {
  id: number;
  nom: string;
  destination: string;
  description: string;
  duree: number;
  prix: number;
  imageUrl: string;
  placesTotal: number;
  placesRestantes: number;
  active: boolean;
  dateDepart: Date;
}

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet]
})
export class TripsComponent implements OnInit, OnDestroy {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  searchTerm: string = '';
  sidebarActive: boolean = false;
  isLoading: boolean = false;

  private refreshSubscription!: Subscription;

  constructor(private router: Router, private circuitService: CircuitService) {}

  ngOnInit(): void {
    this.loadAllTrips();

    this.refreshSubscription = this.circuitService.refreshNeeded$.subscribe(() => {
      this.loadAllTrips();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.sidebarActive = this.hasActiveChild();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  hasActiveChild(): boolean {
    return this.router.url.split('/').length > 3;
  }

  loadAllTrips(): void {
    this.isLoading = true;

    // 🔥 استخدام الدالة الجديدة التي تجلب مصفوفة مباشرة
    this.circuitService.getAllCircuitsList().subscribe({
      next: (data: any[]) => {
        // data هنا هي مصفوفة مباشرة وليست Page
        this.trips = data.map((circuit: any) => ({
          id: circuit.id,
          nom: circuit.distination || 'Voyage ' + circuit.id,
          destination: circuit.distination || 'Destination inconnue',
          description: circuit.description || 'Pas de description',
          duree: circuit.duration || 0,
          prix: circuit.prix || 0,
          imageUrl: circuit.imageUrl || 'assets/default-trip.jpg',
          placesTotal: circuit.nb_places || 0,
          placesRestantes: circuit.nb_places || 0,
          active: true,
          dateDepart: circuit.dateDepart ? new Date(circuit.dateDepart) : new Date()
        }));

        this.filterTrips();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading trips:', err);
        this.isLoading = false;
      }
    });
  }

  filterTrips(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTrips = [...this.trips];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredTrips = this.trips.filter(trip =>
      trip.nom.toLowerCase().includes(term) ||
      trip.destination.toLowerCase().includes(term) ||
      trip.description.toLowerCase().includes(term)
    );
  }

  selectTrip(trip: Trip): void {
    this.router.navigate(['/admin/trips', trip.id]);
  }

  addNewTrip(): void {
    this.router.navigate(['/admin/trips/new']);
  }
}

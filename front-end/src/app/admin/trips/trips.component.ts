// trips/trips.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
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
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  searchTerm: string = '';
  sidebarActive: boolean = false;

  constructor(private router: Router, private circuitService: CircuitService) {}

  ngOnInit(): void {
    this.loadTrips();

    // Listen to router events to detect when sidebar is active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.sidebarActive = this.hasActiveChild();
    });
  }

  // Fetch trips from backend
  loadTrips(): void {
    this.circuitService.getCircuits().subscribe({
      next: (data) => {
        console.log('Raw data from backend:', data); // Debug log
        this.trips = data.map((circuit: any) => {
          // Calculate duration in days
          let duration = 0;
          if (circuit.dateDepart && circuit.dateArrive) {
            const start = new Date(circuit.dateDepart);
            const end = new Date(circuit.dateArrive);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          
          return {
            id: circuit.id,
            nom: circuit.distination || 'Circuit sans nom', // Use destination as name
            destination: circuit.distination || '',
            description: circuit.description || 'Aucune description',
            duree: duration,
            prix: circuit.prix || 0,
            imageUrl: circuit.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
            placesTotal: circuit.nb_places || 0,
            placesRestantes: circuit.nb_places || 0, // Update this if you have reservation logic
            active: true,
            dateDepart: circuit.dateDepart ? new Date(circuit.dateDepart) : new Date()
          };
        });
        this.filteredTrips = [...this.trips];
        console.log('Mapped trips:', this.trips); // Debug log
      },
      error: (err) => console.error('Error loading trips:', err)
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
    console.log('Selecting trip:', trip.id); // Debug log
    this.router.navigate(['/admin/trips', trip.id]);
  }

  addNewTrip(): void {
    this.router.navigate(['/admin/trips/new']);
  }

  getAvailabilityPercentage(trip: Trip): number {
    return (trip.placesRestantes / trip.placesTotal) * 100;
  }

  hasActiveChild(): boolean {
    const url = this.router.url;
    return url.includes('/trips/new') || 
           url.includes('/trips/edit') || 
           /\d+$/.test(url.split('/').pop() || '');
  }

  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }
}
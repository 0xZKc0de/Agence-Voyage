// trips/trips.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

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
  imports: [CommonModule, FormsModule, RouterOutlet] // Add RouterOutlet here
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [
    {
      id: 1,
      nom: 'Marrakech Express',
      destination: 'Marrakech',
      description: 'Découvrez la ville ocre avec ses palais et souks',
      duree: 5,
      prix: 2499,
      imageUrl: 'image1.webp',
      placesTotal: 20,
      placesRestantes: 8,
      active: true,
      dateDepart: new Date('2024-06-15')
    },
    {
      id: 2,
      nom: 'Sahara Adventure',
      destination: 'Merzouga',
      description: 'Nuitée dans le désert et balade à dos de chameau',
      duree: 3,
      prix: 1799,
      imageUrl: 'image2.jpg',
      placesTotal: 15,
      placesRestantes: 3,
      active: true,
      dateDepart: new Date('2024-06-20')
    },
    {
      id: 3,
      nom: 'Côte Atlantique',
      destination: 'Essaouira',
      description: 'Détente sur les plages et découverte de la médina',
      duree: 4,
      prix: 2199,
      imageUrl: 'image3.jpg',
      placesTotal: 18,
      placesRestantes: 12,
      active: true,
      dateDepart: new Date('2024-07-10')
    },
    {
      id: 4,
      nom: 'Montagnes du Rif',
      destination: 'Chefchaouen',
      description: 'Randonnée dans les montagnes bleues',
      duree: 6,
      prix: 2899,
      imageUrl: 'image4.jpg',
      placesTotal: 12,
      placesRestantes: 2,
      active: false,
      dateDepart: new Date('2024-08-05')
    }
  ];
  
  filteredTrips: Trip[] = [];
  searchTerm: string = '';
  sidebarActive: boolean = false;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.filteredTrips = [...this.trips];
    
    // Listen to router events to detect when sidebar is active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.sidebarActive = this.hasActiveChild();
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
  
  getAvailabilityPercentage(trip: Trip): number {
    return (trip.placesRestantes / trip.placesTotal) * 100;
  }
  
  hasActiveChild(): boolean {
    const url = this.router.url;
    return url.includes('/trips/new') || /\d+$/.test(url.split('/').pop() || '');
  }
  
  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }

}
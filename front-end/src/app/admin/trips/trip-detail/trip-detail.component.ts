// trips/trip-detail/trip-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, DatePipe],
})
export class TripDetailComponent implements OnInit {
  trip: Trip | null = null;

  // Minimal mock list of trips
  private allTrips: Trip[] = [
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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tripId = Number(params.get('id'));
      if (tripId) {
        this.loadTrip(tripId);
      }
    });
  }

  loadTrip(id: number): void {
    this.trip = this.allTrips.find(t => t.id === id) || null;

    if (!this.trip) {
      console.warn('Trip not found with id:', id);
      this.closeSidebar();
    }
  }

  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }

  editTrip(): void {
    if (this.trip) {
      this.router.navigate(['/admin/trips/edit', this.trip.id]);
    }
  }

  deleteTrip(): void {
    if (this.trip && confirm(`Êtes-vous sûr de vouloir supprimer le circuit "${this.trip.nom}" ?`)) {
      console.log('Deleting trip:', this.trip.id);
      this.closeSidebar();
    }
  }
}

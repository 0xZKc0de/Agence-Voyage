import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Circuit {
  id: number;
  nom: string;
  destination: string;
  description: string;
  prix: number;
  duree: number;
  dateDepart: string;
  placesTotal: number;
  placesRestantes: number;
  imageUrl: string;
  active: boolean;
}

@Component({
  selector: 'app-circuits',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './circuits.component.html',
  styleUrls: ['./circuits.component.css']
})
export class CircuitsComponent implements OnInit {
  circuits: Circuit[] = [];
  filteredCircuits: Circuit[] = [];
  searchTerm: string = '';
  selectedDestination: string = '';
  selectedDuration: string = '';
  isLoading = true;
  hasActiveChild = false;

  // Options pour les filtres
  destinations: string[] = ['Marakkech', 'Merzouga', 'Essaouira', 'Toubkal'];
  durations: string[] = ['3', '5', '7'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCircuits();
    
    // Vérifier si on a un enfant actif (détail)
    this.route.children.length > 0 ? this.hasActiveChild = true : this.hasActiveChild = false;
  }

  loadCircuits() {
    this.isLoading = true;
    // À remplacer par l'appel API réel
    // this.http.get('/api/circuits').subscribe({
    //   next: (data: any) => {
    //     this.circuits = data;
    //     this.filteredCircuits = data;
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erreur chargement circuits:', error);
    //     this.isLoading = false;
    //   }
    // });

    // Données mockées
    setTimeout(() => {
      this.circuits = [
        {
          id: 1,
          nom: 'Marrakech Impériale',
          destination: 'Marakkech',
          description: 'Découvrez la ville ocre et ses trésors',
          prix: 2999,
          duree: 7,
          dateDepart: '2024-03-15',
          placesTotal: 15,
          placesRestantes: 8,
          imageUrl: 'image1.webp',
          active: true
        },
        {
          id: 2,
          nom: 'Sahara Aventure',
          destination: 'Merzouga',
          description: 'Nuit en bivouac dans le désert',
          prix: 1899,
          duree: 4,
          dateDepart: '2024-04-10',
          placesTotal: 10,
          placesRestantes: 5,
          imageUrl: 'image2.jpg',
          active: true
        },
        {
          id: 3,
          nom: 'Côte Atlantique',
          destination: 'Essaouira',
          description: 'Détente au bord de l\'océan',
          prix: 1599,
          duree: 5,
          dateDepart: '2024-05-20',
          placesTotal: 20,
          placesRestantes: 12,
          imageUrl: 'image3.jpg',
          active: true
        },
        {
          id: 4,
          nom: 'Montagnes de l\'Atlas',
          destination: 'Toubkal',
          description: 'Randonnée au plus haut sommet d\'Afrique du Nord',
          prix: 2499,
          duree: 6,
          dateDepart: '2024-06-05',
          placesTotal: 12,
          placesRestantes: 3,
          imageUrl: 'image4.jpg',
          active: true
        }
      ];
      this.filteredCircuits = this.circuits;
      this.isLoading = false;
    }, 500);
  }

  filterTrips() {
    let filtered = this.circuits;

    // Filtre par recherche texte
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(circuit =>
        circuit.nom.toLowerCase().includes(search) ||
        circuit.destination.toLowerCase().includes(search) ||
        circuit.description.toLowerCase().includes(search)
      );
    }

    // Filtre par destination
    if (this.selectedDestination) {
      filtered = filtered.filter(circuit => 
        circuit.destination === this.selectedDestination
      );
    }

    // Filtre par durée
    if (this.selectedDuration) {
      if (this.selectedDuration === '7+') {
        filtered = filtered.filter(circuit => circuit.duree >= 7);
      } else {
        const duration = parseInt(this.selectedDuration);
        filtered = filtered.filter(circuit => circuit.duree === duration);
      }
    }

    this.filteredCircuits = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDestination = '';
    this.selectedDuration = '';
    this.filterTrips();
  }

  selectCircuit(circuit: Circuit) {
    this.router.navigate(['/client/circuits', circuit.id]);
    this.hasActiveChild = true;
  }

  closeDetail() {
    this.hasActiveChild = false;
    this.router.navigate(['/client/circuits']);
  }

  reserveCircuit(circuit: Circuit) {
    console.log('Réservation du circuit:', circuit.nom);
    // À implémenter: navigation vers la page de réservation
  }
}
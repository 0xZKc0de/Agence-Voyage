import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Circuit {
  id: number;
  distination: string;
  dateDepart: string;
  dateArrive: string;
  prix: number;
  description: string;
  imageUrl: string;
  nb_places: number; // مطابقة لاسم الحقل في Circuit.java
  duration: number;  // مطابقة لـ getDuration() في Circuit.java
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

  isLoading = true;
  hasActiveChild = false;

  searchTerm: string = '';
  selectedDestination: string = '';
  selectedDuration: string = '';

  destinations: string[] = [];
  durations: string[] = ['3', '5', '7', '10'];

  private apiUrl = 'http://localhost:8080/api/v1/circuits';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCircuitsFromApi();

    this.route.url.subscribe(() => {
      this.hasActiveChild = this.route.children.length > 0;
    });
  }

  loadCircuitsFromApi() {
    this.isLoading = true;
    this.http.get<Circuit[]>(this.apiUrl).subscribe({
      next: (data) => {
        // البيانات تأتي جاهزة من الـ API بما فيها duration
        this.circuits = data;
        this.filteredCircuits = [...this.circuits];
        this.extractDestinations();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des circuits:', error);
        this.isLoading = false;
      }
    });
  }

  extractDestinations() {
    const uniqueDestinations = new Set(this.circuits.map(c => c.distination));
    this.destinations = Array.from(uniqueDestinations).sort();
  }

  filterTrips() {
    this.filteredCircuits = this.circuits.filter(circuit => {
      const matchesSearch = !this.searchTerm ||
        (circuit.distination?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          circuit.description?.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesDest = !this.selectedDestination ||
        circuit.distination === this.selectedDestination;

      const matchesDuration = !this.selectedDuration ||
        this.checkDuration(circuit.duration, this.selectedDuration);

      return matchesSearch && matchesDest && matchesDuration;
    });
  }

  private checkDuration(actual: number | undefined, selected: string): boolean {
    if (actual === undefined) return false;
    const dur = parseInt(selected);
    return selected === '7' ? actual >= 7 : actual === dur;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDestination = '';
    this.selectedDuration = '';
    this.filteredCircuits = [...this.circuits];
  }

  selectCircuit(circuit: Circuit) {
    this.router.navigate(['/client/circuits', circuit.id]);
  }

  reserveCircuit(circuit: Circuit) {
    console.log('Réservation du circuit vers :', circuit.distination);
    this.router.navigate(['/client/reserver', circuit.id]);
  }
}

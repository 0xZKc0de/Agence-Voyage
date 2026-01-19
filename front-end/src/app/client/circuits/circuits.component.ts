import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  nb_places: number;
  duration: number;
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
  isLoading = false;

  currentPage = 0;
  pageSize = 8;
  isLastPage = false;

  searchTerm: string = '';
  selectedDestination: string = '';
  selectedDuration: string = '';
  destinations: string[] = [];
  durations: string[] = ['3', '5', '7', '10'];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCircuits();
    this.loadDestinations();
  }

  loadCircuits() {
    if (this.isLoading || this.isLastPage) return;

    this.isLoading = true;

    this.http.get<any>(`http://localhost:8080/api/v1/circuits?page=${this.currentPage}&size=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          this.circuits = [...this.circuits, ...response.content];
          this.isLastPage = response.last;
          this.currentPage++;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  loadDestinations() {
    this.http.get<string[]>('http://localhost:8080/api/v1/circuits/destinations')
      .subscribe(data => this.destinations = data);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      this.loadCircuits();
    }
  }

  filterTrips() {
    // Note: Client-side filtering on loaded items only
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDestination = '';
    this.selectedDuration = '';
  }

  selectCircuit(circuit: Circuit) {
    this.router.navigate(['/client/circuits', circuit.id]);
  }

  reserveCircuit(circuit: Circuit) {
    this.router.navigate(['/client/reservations/create'], {
      queryParams: { circuitId: circuit.id }
    });
  }
}

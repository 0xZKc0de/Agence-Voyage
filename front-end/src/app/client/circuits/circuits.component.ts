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
  filteredCircuits: Circuit[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 8;
  isLastPage = false;

  searchTerm: string = '';
  selectedDestination: string = '';
  destinations: string[] = [];

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
          const newCircuits = response.content || [];
          this.circuits = [...this.circuits, ...newCircuits];
          this.applyFilters();
          this.isLastPage = response.last;
          if(!this.isLastPage) this.currentPage++;
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


  applyFilters() {
    this.filteredCircuits = this.circuits.filter(circuit => {

      const term = this.searchTerm.toLowerCase();
      const matchesSearch = !term ||
        (circuit.distination && circuit.distination.toLowerCase().includes(term)) ||
        (circuit.description && circuit.description.toLowerCase().includes(term));

      const matchesDest = !this.selectedDestination ||
        circuit.distination === this.selectedDestination;

      return matchesSearch && matchesDest;
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      this.loadCircuits();
    }
  }

  selectCircuit(circuit: Circuit) {
    this.router.navigate(['/client/circuits', circuit.id]);
  }
}

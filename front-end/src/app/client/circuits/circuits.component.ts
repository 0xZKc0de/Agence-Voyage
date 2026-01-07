import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// استيراد الخدمة بدلاً من HttpClient فقط
import { CircuitService } from '../../services/circuit.service';

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

  isLoading = true;
  hasActiveChild = false;

  searchTerm: string = '';
  selectedDestination: string = '';
  selectedDuration: string = '';

  destinations: string[] = [];
  durations: string[] = ['3', '5', '7', '10'];

  constructor(
    private circuitService: CircuitService, // حقن الخدمة هنا
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCircuitsFromApi();

    // مراقبة المسارات الفرعية (مثل صفحة التفاصيل)
    this.route.url.subscribe(() => {
      this.hasActiveChild = this.route.children.length > 0;
    });
  }

  loadCircuitsFromApi() {
    this.isLoading = true;

    // استخدام الخدمة بدلاً من http.get المباشر
    this.circuitService.getCircuits().subscribe({
      next: (data) => {
        this.circuits = data;
        this.filteredCircuits = [...this.circuits];
        this.extractDestinations();
        this.isLoading = false;
        console.log('تم تحميل الرحلات بنجاح:', data);
      },
      error: (error) => {
        console.error('فشل في تحميل الرحلات. تأكد من تسجيل الدخول:', error);
        this.isLoading = false;
        // إذا كان الخطأ 401 أو 403، يمكنك توجيه المستخدم لصفحة الدخول
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
    // التوجيه لصفحة تفاصيل الرحلة
    this.router.navigate(['/client/circuits', circuit.id]);
  }

  reserveCircuit(circuit: Circuit) {
    // التوجيه لصفحة الحجز
    this.router.navigate(['/client/reservations/create'], { queryParams: { circuitId: circuit.id } });
  }
}

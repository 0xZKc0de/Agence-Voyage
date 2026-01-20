import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CircuitService } from '../../../services/circuit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  tripId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private circuitService: CircuitService
  ) {
    this.tripForm = this.createForm();
  }

  ngOnInit(): void {
    // Determine if we are in edit mode
    this.route.params.subscribe(params => {
      const id = params['id'];

      // Check if URL ends with 'edit' or simply has an ID
      if (id && this.router.url.includes('/edit')) {
        this.isEditMode = true;
        this.tripId = +id; // Convert to number
        this.loadTripData(this.tripId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      destination: ['', Validators.required],
      description: [''],
      duree: [1, [Validators.required, Validators.min(1)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      placesTotal: [10, [Validators.required, Validators.min(1)]],
      dateDepart: ['', Validators.required],
      imageUrl: ['']
    });
  }

  loadTripData(id: number): void {
    this.loading = true;
    this.circuitService.getCircuitById(id).subscribe({
      next: (data) => {
        // Format date for input type="date" (YYYY-MM-DD)
        let dateStr = '';
        if (data.dateDepart) {
          dateStr = new Date(data.dateDepart).toISOString().split('T')[0];
        }

        this.tripForm.patchValue({
          destination: data.distination, // Note: backend might use 'distination'
          description: data.description,
          duree: data.duration || 0, // Ensure duration is mapped
          prix: data.prix,
          placesTotal: data.nb_places,
          dateDepart: dateStr,
          imageUrl: data.imageUrl
        });
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading trip:', err);
        this.loading = false;
        // Optional: redirect back if not found
      }
    });
  }

  onSubmit(): void {
    console.log('Submit button clicked'); // Debug 1

    if (this.tripForm.invalid) {
      console.error('❌ Form is invalid:', this.tripForm.errors);
      // Log errors for each control to see which one is failing
      Object.keys(this.tripForm.controls).forEach(key => {
        const controlErrors = this.tripForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Control: ${key}, Errors:`, controlErrors);
        }
      });
      return;
    }

    const formData = this.tripForm.value;
    console.log('Form Data:', formData); // Debug 2

    // Calculate Arrival Date based on Duration
    const startDate = new Date(formData.dateDepart);
    const duration = Number(formData.duree); // Ensure number
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    // Prepare Payload
    const circuitData = {
      distination: formData.destination,  // Map 'destination' form to 'distination' backend
      description: formData.description,
      prix: Number(formData.prix),        // Ensure number
      nb_places: Number(formData.placesTotal), // Ensure number
      duration: duration,                 // 🔥 ADDED: Send duration to backend
      dateDepart: startDate.toISOString(),
      dateArrive: endDate.toISOString(),
      imageUrl: formData.imageUrl || null
    };

    console.log('🚀 Payload sent to backend:', circuitData); // Debug 3

    this.loading = true;

    if (this.isEditMode && this.tripId) {
      this.circuitService.updateCircuit(this.tripId, circuitData).subscribe({
        next: () => {
          this.loading = false;
          alert('Circuit mis à jour avec succès');
          this.closeSidebar();
        },
        error: (err: any) => {
          console.error('Error updating circuit:', err);
          this.loading = false;
          alert('Erreur lors de la mise à jour du circuit');
        }
      });
    } else {
      this.circuitService.createCircuit(circuitData).subscribe({
        next: () => {
          this.loading = false;
          alert('Circuit créé avec succès');
          this.closeSidebar();
        },
        error: (err: any) => {
          console.error('Error creating circuit:', err);
          this.loading = false;
          alert('Erreur lors de la création du circuit');
        }
      });
    }
  }

  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }
}

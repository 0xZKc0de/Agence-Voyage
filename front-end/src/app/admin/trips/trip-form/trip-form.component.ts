// trips/trip-form/trip-form.component.ts
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
      const urlSegments = this.router.url.split('/');
      const lastSegment = urlSegments[urlSegments.length - 1];

      if (id && lastSegment === 'edit') {
        this.isEditMode = true;
        this.tripId = Number(id);
        this.loadTripForEdit(this.tripId);
      } else {
        this.isEditMode = false;
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      destination: ['', Validators.required],
      description: ['', Validators.required],
      duree: [1, [Validators.required, Validators.min(1)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      placesTotal: [1, [Validators.required, Validators.min(1)]],
      dateDepart: ['', Validators.required],
      imageUrl: ['']
    });
  }

  loadTripForEdit(id: number): void {
    this.loading = true;
    this.circuitService.getCircuitById(id).subscribe({
      next: (circuit) => {
        const formatDate = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        // Calculate duration
        let duration = 0;
        if (circuit.dateDepart && circuit.dateArrive) {
          const start = new Date(circuit.dateDepart);
          const end = new Date(circuit.dateArrive);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Patch the form
        this.tripForm.patchValue({
          nom: circuit.distination || '',
          destination: circuit.distination || '',
          description: circuit.description || '',
          duree: duration,
          prix: circuit.prix || 0,
          placesTotal: circuit.nb_places || 1,
          dateDepart: formatDate(circuit.dateDepart),
          imageUrl: circuit.imageUrl || ''
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading trip for edit:', err);
        this.loading = false;
        alert('Erreur lors du chargement du circuit');
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.invalid || this.loading) return;

    const formData = this.tripForm.value;

    const startDate = new Date(formData.dateDepart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + formData.duree);

    const circuitData = {
      distination: formData.destination,           // required
      description: formData.description,           // optional
      prix: formData.prix,                         // required
      nb_places: formData.placesTotal,             // required
      dateDepart: startDate.toISOString(),         // ISO format for backend
      dateArrive: endDate.toISOString(),           // ISO format for backend
      imageUrl: formData.imageUrl || null          // optional
    };

    this.loading = true;

    if (this.isEditMode && this.tripId) {
      this.circuitService.updateCircuit(this.tripId, circuitData).subscribe({
        next: () => {
          this.loading = false;
          alert('Circuit mis à jour avec succès');
          this.closeSidebar();
        },
        error: (err) => {
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
        error: (err) => {
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

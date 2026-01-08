import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TripsService, Trip } from '../../../services/trips.service'; // import service

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  tripId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripsService: TripsService
  ) {
    this.tripForm = this.fb.group({
      nom: ['', Validators.required],
      destination: ['', Validators.required],
      description: ['', Validators.required],
      duree: [1, [Validators.required, Validators.min(1)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      placesTotal: [1, [Validators.required, Validators.min(1)]],
      dateDepart: ['', Validators.required],
      active: [true]
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.tripId = Number(params['id']);
        this.loadTripForEdit();
      }
    });
  }

  loadTripForEdit(): void {
    if (!this.tripId) return;

    this.tripsService.getTripById(this.tripId).subscribe({
      next: (trip) => {
        this.tripForm.patchValue(trip);
      },
      error: (err) => {
        console.error('Error loading trip:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.invalid) return;

    const formData: Trip = this.tripForm.value;

    if (this.isEditMode && this.tripId) {
      this.tripsService.updateTrip(this.tripId, formData).subscribe({
        next: () => this.closeSidebar(),
        error: (err) => console.error('Error updating trip:', err)
      });
    } else {
      this.tripsService.createTrip(formData).subscribe({
        next: () => this.closeSidebar(),
        error: (err) => console.error('Error creating trip:', err)
      });
    }
  }

  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }
}

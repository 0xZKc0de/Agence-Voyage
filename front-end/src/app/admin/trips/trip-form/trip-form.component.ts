// trips/trip-form/trip-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule] // Add RouterModule
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  tripId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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
    // In real app, load trip from service
    // For now, set some mock values
    this.tripForm.patchValue({
      nom: 'Marrakech Express',
      destination: 'Marrakech',
      description: 'Découvrez la ville ocre avec ses palais et souks',
      duree: 5,
      prix: 2499,
      imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400',
      placesTotal: 20,
      dateDepart: '2024-06-15',
      active: true
    });
  }
  
  onSubmit(): void {
    if (this.tripForm.valid) {
      const formData = this.tripForm.value;
      
      if (this.isEditMode) {
        console.log('Updating trip:', formData);
        // Call update service
      } else {
        console.log('Creating new trip:', formData);
        // Call create service
      }
      
      this.closeSidebar();
    }
  }
  
  closeSidebar(): void {
    this.router.navigate(['/admin/trips']);
  }
}
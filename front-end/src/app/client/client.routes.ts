import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { HomeComponent } from './website/home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { CircuitsComponent } from './circuits/circuits.component';
import { CircuitDetailComponent } from './circuits/circuit-detail/circuit-detail.component';

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      // Public routes
      { path: 'website', component: HomeComponent },
      { path: 'circuits', component: CircuitsComponent },
      { path: 'circuits/:id', component: CircuitDetailComponent },
      { path: 'profile', component: ProfileComponent},
      
      // Default redirect
      { path: '', redirectTo: 'website', pathMatch: 'full' }
    ]
  }
];
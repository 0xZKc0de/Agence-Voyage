import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trip {
  id?: number;
  nom: string;
  destination: string;
  description: string;
  duree: number;
  prix: number;
  imageUrl?: string;
  placesTotal: number;
  dateDepart: string;
  dateArrivee?: string; // new field
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  // Updated backend endpoint
  private apiUrl = 'http://localhost:8080/api/v1/circuits';

  constructor(private http: HttpClient) {}

  // Create a trip
  createTrip(trip: Trip): Observable<Trip> {
    // Calculate dateArrivee from dateDepart + duree
    const dateDepart = new Date(trip.dateDepart);
    const dateArrivee = new Date(dateDepart);
    dateArrivee.setDate(dateArrivee.getDate() + trip.duree);

    const tripData = {
      ...trip,
      dateArrivee: dateArrivee.toISOString().split('T')[0] // yyyy-MM-dd
    };

    return this.http.post<Trip>(`${this.apiUrl}/add`, tripData, { withCredentials: true });
  }

  // Update a trip
  updateTrip(id: number, trip: Trip): Observable<Trip> {
    const dateDepart = new Date(trip.dateDepart);
    const dateArrivee = new Date(dateDepart);
    dateArrivee.setDate(dateArrivee.getDate() + trip.duree);

    const tripData = {
      ...trip,
      dateArrivee: dateArrivee.toISOString().split('T')[0]
    };

    return this.http.put<Trip>(`${this.apiUrl}/update/${id}`, tripData, { withCredentials: true });
  }

  // Get a trip by ID
  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/get/${id}`, { withCredentials: true });
  }

  // Optional: Get all trips
  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl, { withCredentials: true });
  }
}

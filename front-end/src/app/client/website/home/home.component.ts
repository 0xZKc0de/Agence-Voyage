import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service'; // Assurez-vous que le chemin est correct

interface Circuit {
  id: number;
  nom: string;
  destination: string;
  description: string;
  prix: number;
  duree: number;
  imageUrl: string;
  placesRestantes: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredCircuits: Circuit[] = [];
  isLoading = true;
  isLoggedIn = false; // Variable pour suivre l'état de connexion

  constructor(
    private http: HttpClient,
    private authService: AuthService // Injection du service d'authentification
  ) {}

  ngOnInit() {
    // 1. S'abonner à l'état de l'utilisateur pour mettre à jour l'interface en temps réel
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user; // true si utilisateur connecté, false sinon
    });

    // 2. Charger les circuits (Code existant)
    this.loadFeaturedCircuits();
  }

  loadFeaturedCircuits() {
    this.isLoading = true;
    // Données statiques pour l'exemple (à remplacer par votre appel API)
    this.featuredCircuits = [
      {
        id: 1,
        nom: 'Marrakech Impériale',
        destination: 'Maroc',
        description: 'Découvrez la ville ocre et ses trésors',
        prix: 2999,
        duree: 7,
        imageUrl: 'image1.webp',
        placesRestantes: 8
      },
      {
        id: 2,
        nom: 'Sahara Aventure',
        destination: 'Merzouga',
        description: 'Nuit en bivouac dans le désert',
        prix: 1899,
        duree: 4,
        imageUrl: 'image2.jpg',
        placesRestantes: 5
      }
    ];
    this.isLoading = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // À remplacer par votre API réelle
    this.loadFeaturedCircuits();
  }

  loadFeaturedCircuits() {
    this.isLoading = true;
    // Exemple de données - à remplacer par l'appel API
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
      },
      {
        id: 3,
        nom: 'Côte Atlantique',
        destination: 'Essaouira',
        description: 'Détente au bord de l\'océan',
        prix: 1599,
        duree: 5,
        imageUrl: 'image3.jpg',
        placesRestantes: 12
      },
    ];
    this.isLoading = false;
  }
}

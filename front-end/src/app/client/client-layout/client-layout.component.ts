import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent {
  isLoggedIn = true; // À remplacer par le vrai état d'authentification
  clientName = 'Mariam Chairi'; // À remplacer par les données réelles
  ngOnInit() {
    // Logique d'initialisation si nécessaire
  }
  logout() {
    // Logique de déconnexion
    console.log('Déconnexion...');
    // À implémenter avec le service d'authentification
    this.isLoggedIn = false;
    // Redirection vers la page de login
    // this.router.navigate(['/client/auth/login']);
  }
}
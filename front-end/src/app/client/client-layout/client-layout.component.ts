import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent implements OnInit {
  // Variables pour gérer l'affichage du nom et l'état de connexion
  nomClient: string = '';
  estConnecte: boolean = false;
  chargementEnCours: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 1. S'abonner à l'état de l'utilisateur (Réactivité)
    // Tout changement dans l'état de connexion mettra à jour ces valeurs automatiquement
    this.authService.currentUser$.subscribe({
      next: (utilisateur) => {
        if (utilisateur) {
          this.estConnecte = true;
          this.nomClient = `${utilisateur.firstName} ${utilisateur.lastName}`;
        } else {
          this.estConnecte = false;
          this.nomClient = '';
        }
        this.chargementEnCours = false;
      },
      error: (err) => {
        this.chargementEnCours = false;
        console.error('Erreur lors de la récupération de la session', err);
      }
    });

    // 2. Vérifier la session lors du premier chargement de l'application
    // Cela demande au serveur de vérifier le Cookie de session
    this.authService.checkSession().subscribe();
  }

  deconnexion() {
    this.authService.logout().subscribe({
      next: () => {
        // Redirection vers la page de connexion après une déconnexion réussie du backend
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
        // Même en cas d'erreur, on redirige l'utilisateur
        this.router.navigate(['/auth/login']);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent implements OnInit {
  nomClient: string = '';
  estConnecte: boolean = false;
  chargementEnCours: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
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
        console.error(err);
      }
    });

    this.authService.checkSession().subscribe();
  }

  deconnexion() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}

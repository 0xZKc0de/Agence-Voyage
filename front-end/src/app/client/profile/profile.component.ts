import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  dateInscription: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  client: Client | null = null;
  isLoading = true;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      adresse: [''],
      dateNaissance: ['']
    });
  }

  ngOnInit() {
    this.loadClientProfile();
  }

  loadClientProfile() {
    this.isLoading = true;
    // À remplacer par l'appel API réel
    // this.http.get('/api/client/profile').subscribe({
    //   next: (data: any) => {
    //     this.client = data;
    //     this.profileForm.patchValue(data);
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erreur chargement profil:', error);
    //     this.isLoading = false;
    //   }
    // });

    // Données mockées
    setTimeout(() => {
      this.client = {
        id: 1,
        nom: 'Chairi',
        prenom: 'Mariam',
        email: 'mariam.chairi@email.com',
        telephone: '0612345678',
        adresse: '123 Rue Mohammed V, Tétouan',
        dateNaissance: '2003-09-17',
        dateInscription: '2024-01-10'
      };
      this.profileForm.patchValue(this.client);
      this.isLoading = false;
    }, 500);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.client!);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // À remplacer par l'appel API réel
      // this.http.put('/api/client/profile', this.profileForm.value).subscribe({
      //   next: (data: any) => {
      //     this.client = data;
      //     this.isEditing = false;
      //     this.successMessage = 'Profil mis à jour avec succès!';
      //     this.isLoading = false;
      //     setTimeout(() => this.successMessage = '', 3000);
      //   },
      //   error: (error) => {
      //     this.errorMessage = 'Erreur lors de la mise à jour';
      //     this.isLoading = false;
      //   }
      // });

      // Mock
      setTimeout(() => {
        this.client = { ...this.client!, ...this.profileForm.value };
        this.isEditing = false;
        this.successMessage = 'Profil mis à jour avec succès!';
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  deleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // À remplacer par l'appel API réel
      // this.http.delete('/api/client/profile').subscribe({
      //   next: () => {
      //     // Rediriger vers la page d'accueil
      //   },
      //   error: (error) => {
      //     this.errorMessage = 'Erreur lors de la suppression';
      //   }
      // });
      alert('Compte supprimé (simulation)');
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
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

  // URL de l'API Backend
  private apiUrl = 'http://localhost:8080/api/clients/profile';
  private updateUrl = 'http://localhost:8080/api/clients/update';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  // Charger les données réelles depuis le backend
  loadProfile() {
    this.isLoading = true;
    this.http.get<Client>(this.apiUrl, { withCredentials: true }).subscribe({
      next: (data) => {
        this.client = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Session expirée ou utilisateur non trouvé. Veuillez vous reconnecter.";
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.client) {
      this.profileForm.patchValue(this.client);
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.client) {
      this.isLoading = true;
      const updatedData = { ...this.client, ...this.profileForm.getRawValue() };

      this.http.put(`${this.updateUrl}/${this.client.id}`, updatedData, { withCredentials: true }).subscribe({
        next: (response: any) => {
          this.client = updatedData;
          this.isEditing = false;
          this.successMessage = 'Profil mis à jour avec succès !';
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la mise à jour des données.";
          this.isLoading = false;
        }
      });
    }
  }

  deleteAccount() {
    if (this.client && confirm('Êtes-vous sûr de vouloir supprimer votre compte définitivement ?')) {
      this.http.delete(`http://localhost:8080/api/clients/delete/${this.client.id}`, { withCredentials: true }).subscribe({
        next: () => {
          alert('Compte supprimé.');
          window.location.href = '/login'; // Redirection après suppression
        },
        error: () => {
          this.errorMessage = "Impossible de supprimer le compte.";
        }
      });
    }
  }
}

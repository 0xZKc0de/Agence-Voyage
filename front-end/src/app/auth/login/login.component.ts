import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // تأكد من استيراد الـ Service

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class ClientLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  seConnecter() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.motDePasse
      };

      this.authService.login(credentials).subscribe({
        next: (user) => {
          this.isLoading = false;

          localStorage.setItem('currentUser', JSON.stringify(user));

          if (user.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/client/website']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Email ou le mot de passe est incorrect.';
        }
      });
    }
  }

  allerVersInscription() {
    this.router.navigate(['/auth/register']);
  }
}

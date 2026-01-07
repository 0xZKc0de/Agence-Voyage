import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // تأكد من المسار

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class ClientRegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      confirmMotDePasse: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const pwd = form.get('motDePasse')?.value;
    const confirm = form.get('confirmMotDePasse')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  sinscrire() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // تأكد من إرسال كل الحقول التي يتوقعها الـ RegistrationRequest.java
      const registrationData = {
        firstName: this.registerForm.value.prenom,
        lastName: this.registerForm.value.nom,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.telephone,
        password: this.registerForm.value.motDePasse,
        confirmPassword: this.registerForm.value.confirmMotDePasse // هذا الحقل هو السر!
      };

      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Compte créé avec succès !';
          setTimeout(() => this.router.navigate(['/auth/login']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          // هنا سيعرض لك السيرفر السبب الحقيقي (إما تكرار الإيميل أو تكرار الهاتف)
          this.errorMessage = err.error;
          console.log("Error from server: ", err.error);
        }
      });
    }
  }

  allerVersLogin() {
    this.router.navigate(['/auth/login']);
  }
}

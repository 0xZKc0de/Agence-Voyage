import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        prenom: ['', [Validators.required, Validators.minLength(2)]],
        nom: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        motDePasse: ['', [Validators.required, Validators.minLength(8)]],
        confirmMotDePasse: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const pwd = form.get('motDePasse')?.value;
    const confirm = form.get('confirmMotDePasse')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  sinscrire() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Compte créé avec succès ✔️';

        setTimeout(() => {
          this.router.navigate(['/client/login']);
        }, 1500);
      }, 1000);
    }
  }

  allerVersLogin() {
    this.router.navigate(['/client/login']);
  }
}

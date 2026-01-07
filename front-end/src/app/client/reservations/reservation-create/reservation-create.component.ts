import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Circuit {
  id: number;
  nom: string;
  destination: string;
  description: string;
  prix: number;
  duree: number;
  dateDepart: string;
  placesRestantes: number;
}

@Component({
  selector: 'app-reservation-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.css']
})
export class ReservationCreateComponent implements OnInit {
  reservationForm: FormGroup;
  circuits: Circuit[] = [];
  selectedCircuit: Circuit | null = null;
  isLoading = true;
  isSubmitting = false;
  circuitsLoaded = false; // Nouveau flag

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.reservationForm = this.fb.group({
      circuitId: ['', Validators.required],
      participants: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      dateDepart: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadCircuits().then(() => {
      // Maintenant que les circuits sont chargés, on peut traiter les queryParams
      this.route.queryParams.subscribe(params => {
        if (params['circuitId'] && this.circuitsLoaded) {
          const circuitId = params['circuitId'];
          this.reservationForm.patchValue({
            circuitId: circuitId,
            participants: params['participants'] || 1
          });
          this.onCircuitChange(circuitId);
        }
      });
    });
  }

  // Changez loadCircuits pour retourner une Promise
  async loadCircuits(): Promise<void> {
    this.isLoading = true;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.circuits = [
          {
            id: 1,
            nom: 'Marrakech Impériale',
            destination: 'Marrakech',
            description: 'Découvrez la ville ocre et ses trésors',
            prix: 2999,
            duree: 7,
            dateDepart: '2024-03-15',
            placesRestantes: 8
          },
          {
            id: 2,
            nom: 'Sahara Aventure',
            destination: 'Merzouga',
            description: 'Nuit en bivouac dans le désert',
            prix: 1899,
            duree: 4,
            dateDepart: '2024-04-10',
            placesRestantes: 5
          },
          {
            id: 3,
            nom: 'Côte Atlantique',
            destination: 'Essaouira',
            description: 'Détente au bord de l\'océan',
            prix: 1599,
            duree: 5,
            dateDepart: '2024-05-20',
            placesRestantes: 12
          },
          {
            id: 4,
            nom: 'Montagnes de l\'Atlas',
            destination: 'Toubkal',
            description: 'Randonnée au plus haut sommet d\'Afrique du Nord',
            prix: 2499,
            duree: 6,
            dateDepart: '2024-06-05',
            placesRestantes: 3
          }
        ];
        this.isLoading = false;
        this.circuitsLoaded = true; // Circuits chargés
        
        resolve();
      }, 500);
    });
  }

  onCircuitChange(circuitId: string) {
    
    if (!this.circuitsLoaded || this.circuits.length === 0) {
      console.log('⚠️ Circuits pas encore chargés, on attend...');
      // Si les circuits ne sont pas chargés, on réessaye dans 100ms
      setTimeout(() => {
        this.onCircuitChange(circuitId);
      }, 100);
      return;
    }
    
    if (!circuitId || circuitId === '') {
      console.log('⚠️ circuitId est vide ou null');
      this.selectedCircuit = null;
      return;
    }
    
    const id = parseInt(circuitId);
    console.log('ID converti:', id);
    console.log('Circuits disponibles:', this.circuits.map(c => ({id: c.id, nom: c.nom})));
    
    this.selectedCircuit = this.circuits.find(c => c.id === id) || null;
    console.log('Circuit trouvé:', this.selectedCircuit?.nom);
    
    if (this.selectedCircuit) {
      
      this.reservationForm.patchValue({
        dateDepart: this.selectedCircuit.dateDepart
      });
      
      const participants = this.reservationForm.get('participants')?.value || 1;
      
      
      if (participants > this.selectedCircuit.placesRestantes) {
        
        this.reservationForm.patchValue({
          participants: this.selectedCircuit.placesRestantes
        });
      }
    } else {
      
    }
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  incrementParticipants() {
    const current = this.reservationForm.get('participants')?.value || 1;
    const max = this.selectedCircuit?.placesRestantes || 10;
    if (current < max) {
      this.reservationForm.patchValue({ participants: current + 1 });
    }
  }

  decrementParticipants() {
    const current = this.reservationForm.get('participants')?.value || 1;
    if (current > 1) {
      this.reservationForm.patchValue({ participants: current - 1 });
    }
  }

  calculateTotal(): number {
    const participants = this.reservationForm.get('participants')?.value || 0;
    const circuitPrice = this.selectedCircuit?.prix || 0;
    
    return participants * circuitPrice;
  }

  onSubmit() {
    
    // Vérifier que les circuits sont chargés
    if (!this.circuitsLoaded) {
      console.log('⚠️ Circuits pas encore chargés, on attend...');
      setTimeout(() => this.onSubmit(), 100);
      return;
    }
    
    // 1. Forcer la mise à jour du circuit
    const circuitId = this.reservationForm.get('circuitId')?.value;
    console.log('circuitId from form:', circuitId);
    
    if (circuitId) {
      this.onCircuitChange(circuitId.toString());
    }
    
    // Petit délai pour laisser onCircuitChange s'exécuter
    setTimeout(() => {
      
      if (this.reservationForm.valid && this.selectedCircuit) {
        
        const amount = this.calculateTotal();
        
        if (amount <= 0) {
          alert('Erreur: Le montant à payer est invalide.');
          return;
        }
        
        // Navigation vers le paiement
        this.router.navigate(['/client/payment/paypal'], {
          queryParams: {
            clientEmail: 'mariam.chairi@email.com',
            reservationId: Math.floor(Math.random() * 1000),
            amount: amount
          }
        }).then(success => {
         
        }).catch(error => {
          
        });
        
      } else {
        
        if (!this.reservationForm.valid) {
          console.log('  - Formulaire invalide');
          this.reservationForm.markAllAsTouched();
          
          Object.keys(this.reservationForm.controls).forEach(key => {
            const control = this.reservationForm.get(key);
            if (control?.errors) {
              console.log(`    ${key}:`, control.errors);
            }
          });
        }
        
        if (!this.selectedCircuit) {
          alert('⚠️ Veuillez sélectionner un circuit.');
        }
      }
    }, 200); // Délai plus long pour être sûr
  }

  cancel() {
    this.router.navigate(['/client/reservations']);
  }

  onParticipantsChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    
    if (this.selectedCircuit) {
      if (value > this.selectedCircuit.placesRestantes) {
        this.reservationForm.patchValue({
          participants: this.selectedCircuit.placesRestantes
        });
      } else if (value < 1) {
        this.reservationForm.patchValue({ participants: 1 });
      }
    }
  }

  // Méthode utilitaire pour forcer la sélection
  forceSelectCircuit() {
    if (this.circuits.length > 0 && this.reservationForm.get('circuitId')?.value) {
      const circuitId = this.reservationForm.get('circuitId')?.value;
      console.log('Forcer sélection du circuit:', circuitId);
      this.selectedCircuit = this.circuits.find(c => c.id === parseInt(circuitId)) || null;
      console.log('Circuit forcé sélectionné:', this.selectedCircuit?.nom);
    }
  }
}
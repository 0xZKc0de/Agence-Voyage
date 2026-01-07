import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Circuit {
  id: number;
  nom: string;
  destination: string;
  description: string;
  prix: number;
  duree: number;
  dateDepart: string;
  placesTotal: number;
  placesRestantes: number;
  imageUrl: string;
  active: boolean;
  programme: string[];
  inclus: string[];
  nonInclus: string[];
}

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circuit-detail.component.html',
  styleUrls: ['./circuit-detail.component.css']
})
export class CircuitDetailComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  circuitId!: number;
  circuit: Circuit | null = null;
  isLoading = true;
  showReservationForm = false;
  participants = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.circuitId = +this.route.snapshot.params['id'];
    this.loadCircuitDetails();
  }

  loadCircuitDetails() {
    this.isLoading = true;
    // À remplacer par l'appel API réel
    // this.http.get(`/api/circuits/${this.circuitId}`).subscribe({
    //   next: (data: any) => {
    //     this.circuit = data;
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erreur chargement détail circuit:', error);
    //     this.isLoading = false;
    //     this.closeDetail();
    //   }
    // });

    // Données mockées
    setTimeout(() => {
      this.circuit = {
        id: this.circuitId,
        nom: 'Marrakech Impériale',
        destination: 'Maroc',
        description: 'Découvrez la ville ocre et ses trésors. Ce circuit vous emmène à la découverte des trésors de Marrakech, des souks colorés aux palais historiques.',
        prix: 2999,
        duree: 7,
        dateDepart: '2024-03-15',
        placesTotal: 15,
        placesRestantes: 8,
        imageUrl: 'image1.webp',
        active: true,
        programme: [
          'Jour 1: Arrivée à Marrakech - Transfert à l\'hôtel',
          'Jour 2: Visite de la Médina et des souks',
          'Jour 3: Jardin Majorelle et Musée Yves Saint Laurent',
          'Jour 4: Excursion aux cascades d\'Ouzoud',
          'Jour 5: Désert d\'Agafay et dîner berbère',
          'Jour 6: Palais Bahia et Palais El Badi',
          'Jour 7: Transfert à l\'aéroport - Départ'
        ],
        inclus: [
          'Hébergement en hôtel 4*',
          'Petit déjeuner quotidien',
          'Transferts aéroport',
          'Guide francophone',
          'Entrées aux monuments'
        ],
        nonInclus: [
          'Vols internationaux',
          'Assurance voyage',
          'Dépenses personnelles',
          'Pourboires'
        ]
      };
      this.isLoading = false;
    }, 500);
  }

  closeDetail() {
    this.close.emit();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  toggleReservationForm() {
    this.showReservationForm = !this.showReservationForm;
  }

  incrementParticipants() {
    if (this.participants < (this.circuit?.placesRestantes || 1)) {
      this.participants++;
    }
  }

  decrementParticipants() {
    if (this.participants > 1) {
      this.participants--;
    }
  }

  calculateTotal(): number {
    return (this.circuit?.prix || 0) * this.participants;
  }

  reserveCircuit() {
    if (this.circuit && this.participants <= this.circuit.placesRestantes) {
      this.router.navigate(['/client/reservations/create'], {
        queryParams: {
          circuitId: this.circuit.id,
          participants: this.participants,
          prix: this.circuit.prix,
          total: this.calculateTotal()
        }
      });
    }
  }
}
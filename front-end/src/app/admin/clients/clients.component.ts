import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {

  searchTerm: string = '';

  clients = [
    {
      id: 1,
      nom: 'Ahmed Benali',
      email: 'ahmed@gmail.com',
      telephone: '0612345678',
      ville: 'Casablanca',
      reservations: 5,
      active: true
    },
    {
      id: 2,
      nom: 'Sarah Amrani',
      email: 'sarah@gmail.com',
      telephone: '0623456789',
      ville: 'Rabat',
      reservations: 4,
      active: true
    },
    {
      id: 3,
      nom: 'Youssef El Idrissi',
      email: 'youssef@gmail.com',
      telephone: '0634567890',
      ville: 'Tanger',
      reservations: 2,
      active: false
    }
  ];

  get filteredClients() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      return this.clients;
    }

    return this.clients.filter(client =>
      client.nom.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.telephone.includes(term) ||
      client.ville.toLowerCase().includes(term)
    );
  }

  toggleStatus(client: any) {
    client.active = !client.active;

    // Later → backend API
  }
}

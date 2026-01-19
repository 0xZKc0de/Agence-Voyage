import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, ClientData } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  searchTerm: string = '';
  clients: ClientData[] = [];
  loading: boolean = false; // optional: to show a spinner while loading

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Load all clients
  loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (data: ClientData[]) => {
        // Map to ensure all fields are defined
        this.clients = data.map(c => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email ?? '',
          phone: c.phone ?? '',
          reservationsCount: c.reservationsCount ?? 0,
          totalAmount: c.totalAmount ?? 0
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading clients', err);
        this.loading = false;
      }
    });
  }

  // Filter clients based on search term
  get filteredClients(): ClientData[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.clients;

    return this.clients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(term) ||
      (client.email ?? '').toLowerCase().includes(term) ||
      (client.phone ?? '').includes(term)
    );
  }

deleteClient(client: ClientData) {
  if (!client.id) return;

  if (confirm(`Voulez-vous vraiment supprimer le client ${client.firstName} ${client.lastName} ?`)) {
    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        console.log('Client deleted', client);
        // Method 1: Reload from server (simplest)
        this.loadClients();
        
        // Method 2: Remove locally and refresh filtered list
        // this.clients = this.clients.filter(c => c.id !== client.id);
        // Trigger change detection for the getter
        // this.clients = [...this.clients]; // Creates new array reference
      },
      error: (err) => console.error('Error deleting client', err)
    });
  }
}


}
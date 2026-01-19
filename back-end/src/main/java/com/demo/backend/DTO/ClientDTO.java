package com.demo.backend.DTO;

import com.demo.backend.Entity.Client;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Integer id;              // optional for top clients
    private String firstName;
    private String lastName;
    private String email;            // optional for top clients
    private String phone;            // optional for top clients
    private int reservationsCount;   // always present
    private Double totalAmount;      // optional, only for top clients

    public ClientDTO(Client client) {
        this.id = client.getId();
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.email = client.getEmail();
        this.phone = client.getPhone();
        this.reservationsCount = client.getReservations() != null ? client.getReservations().size() : 0;
    }
}

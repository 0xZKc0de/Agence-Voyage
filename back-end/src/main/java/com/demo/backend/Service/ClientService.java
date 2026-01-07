package com.demo.backend.Service;


import com.demo.backend.DTO.RegistrationRequest;
import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Client registerNewClient(RegistrationRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Client client = new Client();
        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setPassword(request.getPassword());
        client.setRole("ROLE_CLIENT");

        Admin defaultAdmin = adminRepository.findById(1).get();
        client.setAdmin(defaultAdmin);

        return clientRepository.save(client);
    }


    public Client updateClient(int id, Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setFirstName(clientDetails.getFirstName());
        client.setLastName(clientDetails.getLastName());
        client.setPhone(clientDetails.getPhone());

        return clientRepository.save(client);
    }

    public void deleteClient(int id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        clientRepository.delete(client);
    }
}
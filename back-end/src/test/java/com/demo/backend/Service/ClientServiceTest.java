package com.demo.backend.Service;

// JUnit 5 + Mockito

import com.demo.backend.DTO.ClientDTO;
import com.demo.backend.DTO.RegistrationRequest;
import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ClientService clientService;

    // =========================
    // registerNewClient
    // =========================

    @Test
    void shouldRegisterNewClientSuccessfully() {
        RegistrationRequest request = new RegistrationRequest();
        request.setFirstName("Mariam");
        request.setLastName("Chairi");
        request.setEmail("mariam@test.com");
        request.setPhone("0600000000");
        request.setPassword("1234");
        request.setConfirmPassword("1234");

        Admin admin = new Admin();
        admin.setId(1);

        when(clientRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(clientRepository.existsByPhone(request.getPhone())).thenReturn(false);
        when(passwordEncoder.encode("1234")).thenReturn("encoded1234");
        when(adminRepository.findById(1)).thenReturn(Optional.of(admin));
        when(clientRepository.save(any(Client.class))).thenAnswer(i -> i.getArgument(0));

        Client result = clientService.registerNewClient(request);

        assertEquals("Mariam", result.getFirstName());
        assertEquals("encoded1234", result.getPassword());
        assertEquals("ROLE_CLIENT", result.getRole());
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void shouldThrowExceptionWhenPasswordsDoNotMatch() {
        RegistrationRequest request = new RegistrationRequest();
        request.setPassword("1234");
        request.setConfirmPassword("0000");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> clientService.registerNewClient(request));

        assertEquals("Passwords do not match!", ex.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@test.com");
        request.setPassword("1234");
        request.setConfirmPassword("1234");

        when(clientRepository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> clientService.registerNewClient(request));

        assertEquals("Email is already in use!", ex.getMessage());
    }

    // =========================
    // updateClient
    // =========================

    @Test
    void shouldUpdateClientSuccessfully() {
        Client existing = new Client();
        existing.setId(1);
        existing.setFirstName("Old");

        Client updated = new Client();
        updated.setFirstName("New");
        updated.setLastName("Name");
        updated.setEmail("new@test.com");
        updated.setPhone("0700000000");

        when(clientRepository.findById(1)).thenReturn(Optional.of(existing));
        when(clientRepository.save(existing)).thenReturn(existing);

        Client result = clientService.updateClient(1, updated);

        assertEquals("New", result.getFirstName());
        assertEquals("new@test.com", result.getEmail());
    }

    @Test
    void shouldThrowExceptionWhenClientNotFoundOnUpdate() {
        when(clientRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> clientService.updateClient(99, new Client()));
    }

    // =========================
    // deleteClient
    // =========================

    @Test
    void shouldDeleteClientSuccessfully() {
        when(clientRepository.existsById(1)).thenReturn(true);

        clientService.deleteClient(1);

        verify(clientRepository).deleteById(1);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistingClient() {
        when(clientRepository.existsById(1)).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> clientService.deleteClient(1));
    }

    // =========================
    // getClientsCount & findById
    // =========================

    @Test
    void shouldReturnClientsCount() {
        when(clientRepository.count()).thenReturn(5L);

        long count = clientService.getClientsCount();

        assertEquals(5L, count);
    }

    @Test
    void shouldFindClientById() {
        Client client = new Client();
        client.setId(1);

        when(clientRepository.findById(1)).thenReturn(Optional.of(client));

        Optional<Client> result = clientService.findById(1);

        assertTrue(result.isPresent());
    }

    // =========================
    // getAllClientsDTO
    // =========================

    @Test
    void shouldReturnAllClientsDTO() {
        Client client1 = new Client();
        client1.setFirstName("A");

        Client client2 = new Client();
        client2.setFirstName("B");

        when(clientRepository.findAll()).thenReturn(List.of(client1, client2));

        List<ClientDTO> result = clientService.getAllClientsDTO();

        assertEquals(2, result.size());
    }

    // =========================
    // getTopClientsDTO
    // =========================

    @Test
    void shouldReturnTopClientsLimited() {
        Client client = new Client();
        client.setFirstName("Top");

        when(clientRepository.findAll()).thenReturn(List.of(client));

        List<ClientDTO> result = clientService.getTopClientsDTO(1);

        assertEquals(1, result.size());
    }
}

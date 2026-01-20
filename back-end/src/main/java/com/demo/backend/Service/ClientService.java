package com.demo.backend.Service;

import com.demo.backend.DTO.ClientDTO;
import com.demo.backend.DTO.RegistrationRequest;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Client registerNewClient(RegistrationRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (clientRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number is already in use!");
        }

        Client client = new Client();
        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setRole("ROLE_CLIENT");
        client.setAdmin(adminRepository.findById(1).orElse(null));

        return clientRepository.save(client);
    }

    // 🔥 هذه الدالة كانت ناقصة، وتمت إضافتها لإصلاح الخطأ في Controller
    public Client updateClient(int id, Client clientDetails) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));

        existingClient.setFirstName(clientDetails.getFirstName());
        existingClient.setLastName(clientDetails.getLastName());
        existingClient.setPhone(clientDetails.getPhone());
        existingClient.setEmail(clientDetails.getEmail());
        // ملاحظة: لا نحدث كلمة المرور هنا لأسباب أمنية

        return clientRepository.save(existingClient);
    }

    public void deleteClient(int id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found!");
        }
        clientRepository.deleteById(id);
    }

    public long getClientsCount() {
        return clientRepository.count();
    }

    public Optional<Client> findById(int id) {
        return clientRepository.findById(id);
    }

    // ✅ هذه الدالة ستضمن عمل القائمة في الفرونت إند بفضل Transactional
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClientsDTO() {
        return clientRepository.findAll()
                .stream()
                .map(ClientDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> getTopClientsDTO(int limit) {
        return clientRepository.findAll()
                .stream()
                .map(client -> {
                    int resCount = client.getReservations() != null ? client.getReservations().size() : 0;
                    double total = client.getReservations() != null
                            ? client.getReservations().stream()
                            .filter(r -> r.getCircuit() != null)
                            .mapToDouble(r -> r.getNbPersons() * r.getCircuit().getPrix())
                            .sum()
                            : 0;

                    ClientDTO dto = new ClientDTO();
                    dto.setId(client.getId());
                    dto.setFirstName(client.getFirstName());
                    dto.setLastName(client.getLastName());
                    dto.setEmail(client.getEmail());
                    dto.setReservationsCount(resCount);
                    dto.setTotalAmount(total);
                    return dto;
                })
                .sorted((a, b) -> Double.compare(
                        b.getTotalAmount() != null ? b.getTotalAmount() : 0,
                        a.getTotalAmount() != null ? a.getTotalAmount() : 0))
                .limit(limit)
                .toList();
    }
}
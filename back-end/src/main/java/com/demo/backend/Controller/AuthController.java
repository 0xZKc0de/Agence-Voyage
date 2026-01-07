package com.demo.backend.Controller;

import com.demo.backend.DTO.LoginRequest;
import com.demo.backend.DTO.RegistrationRequest;
import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import com.demo.backend.Service.ClientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientService clientService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());
        if (admin.isPresent() && admin.get().getPassword().equals(request.getPassword())) {
            createSession(httpRequest, admin.get().getEmail(), "ADMIN", admin.get().getId());
            return ResponseEntity.ok(admin.get());
        }

        Optional<Client> client = clientRepository.findByEmail(request.getEmail());
        if (client.isPresent() && client.get().getPassword().equals(request.getPassword())) {
            createSession(httpRequest, client.get().getEmail(), "CLIENT", client.get().getId());
            return ResponseEntity.ok(client.get());
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    private void createSession(HttpServletRequest request, String email, String role, int id) {
        HttpSession session = request.getSession(true);
        session.setAttribute("email", email);
        session.setAttribute("role", role);
        session.setAttribute("userId", id);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        try {
            Client newClient = clientService.registerNewClient(request);
            return ResponseEntity.ok(newClient);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
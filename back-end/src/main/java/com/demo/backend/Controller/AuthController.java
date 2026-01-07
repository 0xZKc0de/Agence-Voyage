package com.demo.backend.Controller;

import com.demo.backend.DTO.LoginRequest;
import com.demo.backend.DTO.RegistrationRequest;
import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import com.demo.backend.Service.ClientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true") // مهم جداً: allowCredentials
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientService clientService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse) {

        // 1. التحقق من الأدمن
        Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());
        if (admin.isPresent() && passwordEncoder.matches(request.getPassword(), admin.get().getPassword())) {
            authenticateUser(httpRequest, httpResponse, admin.get().getEmail(), admin.get().getRole(), admin.get().getId());
            return ResponseEntity.ok(admin.get());
        }

        // 2. التحقق من العميل
        Optional<Client> client = clientRepository.findByEmail(request.getEmail());
        if (client.isPresent() && passwordEncoder.matches(request.getPassword(), client.get().getPassword())) {
            authenticateUser(httpRequest, httpResponse, client.get().getEmail(), client.get().getRole(), client.get().getId());
            return ResponseEntity.ok(client.get());
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }

    private void authenticateUser(HttpServletRequest request, HttpServletResponse response, String email, String role, int id) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                email, null, AuthorityUtils.createAuthorityList(role));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        // حفظ الجلسة لكي يتذكر السيرفر المتصفح
        securityContextRepository.saveContext(context, request, response);

        HttpSession session = request.getSession(true);
        session.setAttribute("userId", id);
        session.setAttribute("role", role);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        SecurityContextHolder.clearContext();
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
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
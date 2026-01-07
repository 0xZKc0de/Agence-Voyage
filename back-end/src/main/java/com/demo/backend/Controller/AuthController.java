package com.demo.backend.Controller;

import com.demo.backend.DTO.LoginRequest;
import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
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
    private SecurityContextRepository securityContextRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

        Optional<Admin> admin = adminRepository.findByEmail(request.getEmail());
        // ملاحظة: إذا كانت كلمة المرور غير مشفرة في DB، استخدم .equals() مؤقتاً للتجربة
        if (admin.isPresent() && admin.get().getPassword().equals(request.getPassword())) {
            setSpringAuth(httpRequest, httpResponse, admin.get().getEmail(), admin.get().getRole(), admin.get().getId());
            return ResponseEntity.ok(admin.get());
        }

        Optional<Client> client = clientRepository.findByEmail(request.getEmail());
        if (client.isPresent() && client.get().getPassword().equals(request.getPassword())) {
            setSpringAuth(httpRequest, httpResponse, client.get().getEmail(), client.get().getRole(), client.get().getId());
            return ResponseEntity.ok(client.get());
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }

    private void setSpringAuth(HttpServletRequest request, HttpServletResponse response, String email, String role, int id) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                email, null, AuthorityUtils.createAuthorityList(role));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        // حفظ السياق في المستودع (ضروري في Spring Security 6)
        securityContextRepository.saveContext(context, request, response);

        HttpSession session = request.getSession(true);
        session.setAttribute("role", role);
        session.setAttribute("userId", id);
    }
}
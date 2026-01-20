package com.demo.backend.Controller;

import com.demo.backend.DTO.ClientDTO;
import com.demo.backend.Entity.Client;
import com.demo.backend.Service.ClientService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ClientController {

    @Autowired
    private ClientService clientService;

    // ✅ هذا الرابط هو المسؤول عن عرض القائمة في الفرونت إند
    // سيعمل الآن لأن Service يعيد DTO وفيه Transactional
    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClientsDTO());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {
        Integer loggedUserId = (Integer) session.getAttribute("userId");

        if (loggedUserId == null) {
            return ResponseEntity.status(401).body("Erreur : Vous devez être connecté.");
        }

        try {
            Optional<Client> client = clientService.findById(loggedUserId);
            return client.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(404).build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne.");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateClient(@PathVariable int id, @RequestBody Client client, HttpSession session) {
        String role = (String) session.getAttribute("role");
        Integer loggedUserId = (Integer) session.getAttribute("userId");

        // السماح للأدمن أو صاحب الحساب فقط بالتعديل
        if (role != null && (role.equals("ROLE_ADMIN") || (role.equals("ROLE_CLIENT") && loggedUserId != null && loggedUserId == id))) {
            return ResponseEntity.ok(clientService.updateClient(id, client));
        }

        return ResponseEntity.status(403).body("Accès refusé.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable int id, HttpSession session) {
        Integer loggedUserId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (role != null && (role.equals("ROLE_ADMIN") || (role.equals("ROLE_CLIENT") && loggedUserId != null && loggedUserId == id))) {
            clientService.deleteClient(id);

            if (role.equals("ROLE_CLIENT")) {
                session.invalidate(); // تسجيل خروج إذا حذف العميل حسابه بنفسه
            }
            return ResponseEntity.ok("Compte supprimé avec succès.");
        }

        return ResponseEntity.status(403).body("Accès refusé.");
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getClientsCount() {
        return ResponseEntity.ok(clientService.getClientsCount());
    }

    @GetMapping("/top")
    public ResponseEntity<List<ClientDTO>> getTopClients(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(clientService.getTopClientsDTO(limit));
    }
}
package com.demo.backend.Controller;

import com.demo.backend.Entity.Client;
import com.demo.backend.Service.ClientService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateClient(@PathVariable int id, @RequestBody Client client, HttpSession session) {
        Integer loggedUserId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        
        if (role != null && (role.equals("ROLE_ADMIN") || (role.equals("ROLE_CLIENT") && loggedUserId != null && loggedUserId == id))) {
            return ResponseEntity.ok(clientService.updateClient(id, client));
        }

        return ResponseEntity.status(403).body("You are not authorized to update this profile");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable int id, HttpSession session) {
        Integer loggedUserId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (role != null && (role.equals("ROLE_ADMIN") || (role.equals("ROLE_CLIENT") && loggedUserId != null && loggedUserId == id))) {
            clientService.deleteClient(id);

            if (role.equals("ROLE_CLIENT")) {
                session.invalidate();
            }

            return ResponseEntity.ok("Client deleted successfully");
        }

        return ResponseEntity.status(403).body("You are not authorized to delete this profile");
    }
}
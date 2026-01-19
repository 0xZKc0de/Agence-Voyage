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

    /**
     * Récupérer les informations du profil de l'utilisateur connecté via la session.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {
        Integer loggedUserId = (Integer) session.getAttribute("userId");

        if (loggedUserId == null) {
            return ResponseEntity.status(401).body("Erreur : Vous devez être connecté pour accéder au profil.");
        }

        try {
            Optional<Client> client = clientService.findById(loggedUserId);
            if (client.isPresent()) {
                return ResponseEntity.ok(client.get());
            } else {
                return ResponseEntity.status(404).body("Erreur : Utilisateur non trouvé.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne du serveur.");
        }
    }

    /**
     * Mettre à jour les données du client (Autorisé pour l'Admin ou le propriétaire du compte).
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateClient(@PathVariable int id, @RequestBody Client client, HttpSession session) {
        String role = (String) session.getAttribute("role");
        Integer loggedUserId = (Integer) session.getAttribute("userId");

        // Vérification des droits : Admin ou le client lui-même
        if (role != null && (role.equals("ROLE_ADMIN") || (role.equals("ROLE_CLIENT") && loggedUserId != null && loggedUserId == id))) {
            client.setId(id);
            return ResponseEntity.ok(clientService.updateClient(id, client));
        }

        return ResponseEntity.status(403).body("Accès refusé : Vous n'êtes pas autorisé à modifier ces données.");
    }

    /**
     * Supprimer le compte client (Autorisé pour l'Admin ou le propriétaire du compte).
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable int id, HttpSession session) {
        Integer loggedUserId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (role != null && (role.equals("ROLE_ADMIN") || (role.equals("ROLE_CLIENT") && loggedUserId != null && loggedUserId == id))) {
            clientService.deleteClient(id);

            // Si c'est le client qui supprime son propre compte, on invalide la session
            if (role.equals("ROLE_CLIENT")) {
                session.invalidate();
            }

            return ResponseEntity.ok("Compte supprimé avec succès.");
        }

        return ResponseEntity.status(403).body("Accès refusé : Vous n'êtes pas autorisé à supprimer ce compte.");
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getClientsCount() {
        return ResponseEntity.ok(clientService.getClientsCount());
    }


    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClientsDTO());
    }

    @GetMapping("/top")
    public ResponseEntity<List<ClientDTO>> getTopClients(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(clientService.getTopClientsDTO(limit));
    }




}
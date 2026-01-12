package com.demo.backend.Service;

import com.demo.backend.DTO.ReservationRequest;
import com.demo.backend.Entity.*;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.CircuitRepository;
import com.demo.backend.Repository.ClientRepository;
import com.demo.backend.Repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private CircuitRepository circuitRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private ClientRepository clientRepository;

    public Reservation initiateReservation(ReservationRequest request) {

        Circuit circuit = circuitRepository.findById(request.getCircuitId())
                .orElseThrow(() -> new RuntimeException("Circuit not found"));

        Admin admin = adminRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Client client = clientRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Reservation res = new Reservation();
        res.setCircuit(circuit);
        res.setAdmin(admin);
        res.setClient(client);
        res.setNbPersons(request.getNbPersons());
        res.setDateReservation(new Date());
        res.setStatus("PENDING");

        return reservationRepository.save(res);
    }

    @Transactional
    public Reservation cancelReservation(int id) {
        Reservation res = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if ("CANCELLED".equals(res.getStatus())) {
            throw new RuntimeException("This reservation is already cancelled");
        }

        if ("PAID".equals(res.getStatus())) {
            throw new RuntimeException("Cannot cancel a paid reservation directly. Please contact support.");
        }

        res.setStatus("CANCELLED");

        return reservationRepository.save(res);
    }

    @Transactional
    public Reservation updateReservation(int id, ReservationRequest request) {
        Reservation res = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!"PENDING".equals(res.getStatus())) {
            throw new RuntimeException("Cannot update reservation. Only PENDING reservations can be modified.");
        }

        if (request.getCircuitId() != 0) {
            Circuit circuit = circuitRepository.findById(request.getCircuitId())
                    .orElseThrow(() -> new RuntimeException("New Circuit not found"));
            res.setCircuit(circuit);
        }

        res.setNbPersons(request.getNbPersons());
        res.setDateReservation(new Date());

        return reservationRepository.save(res);
    }
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public long getReservationsCount() {
        return reservationRepository.count();
    }

    public List<Reservation> getMyReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        return reservationRepository.findByClientEmail(currentEmail);
    }

}
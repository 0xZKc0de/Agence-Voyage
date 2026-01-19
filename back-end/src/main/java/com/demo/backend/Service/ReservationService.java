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

    @Transactional
    public Reservation initiateReservation(ReservationRequest request) {

        Circuit circuit = circuitRepository.findById(request.getCircuitId())
                .orElseThrow(() -> new RuntimeException("Circuit not found"));

        // 1. Check availability and decrement stock
        if (circuit.getNb_places() < request.getNbPersons()) {
            throw new RuntimeException("Not enough places available. Remaining: " + circuit.getNb_places());
        }

        circuit.setNb_places(circuit.getNb_places() - request.getNbPersons());
        circuitRepository.save(circuit);

        Admin admin = adminRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // 2. Get the currently logged-in client
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        Client client = clientRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Client not found for email: " + currentEmail));

        Reservation reservation = new Reservation();
        reservation.setDateReservation(new Date());
        reservation.setNbPersons(request.getNbPersons());
        reservation.setCircuit(circuit);
        reservation.setClient(client);
        reservation.setAdmin(admin);
        reservation.setStatus("PENDING");

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation cancelReservation(int id) {
        Reservation res = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!"PENDING".equals(res.getStatus())) {
            throw new RuntimeException("Cannot cancel reservation. Status is not PENDING.");
        }

        // 3. Restore stock upon cancellation
        Circuit circuit = res.getCircuit();
        if (circuit != null) {
            circuit.setNb_places(circuit.getNb_places() + res.getNbPersons());
            circuitRepository.save(circuit);
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

    public double getTotalRevenue() {
        List<Reservation> reservations = reservationRepository.findAll();

        return reservations.stream()
                .filter(res -> res.getCircuit() != null) // skip reservations without a circuit
                .mapToDouble(res -> res.getNbPersons() * res.getCircuit().getPrix())
                .sum();
    }
}
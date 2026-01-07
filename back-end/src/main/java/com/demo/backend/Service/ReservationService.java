package com.demo.backend.Service;

import com.demo.backend.DTO.ReservationRequest;
import com.demo.backend.Entity.*;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.CircuitRepository;
import com.demo.backend.Repository.ClientRepository;
import com.demo.backend.Repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
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
}
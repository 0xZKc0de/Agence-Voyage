package com.demo.backend.Controller;

import com.demo.backend.DTO.ReservationRequest;
import com.demo.backend.Entity.Reservation;
import com.demo.backend.Service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin("*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping("/create")
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequest request) {

        Reservation reservation = reservationService.initiateReservation(request);
        return ResponseEntity.ok(reservation);
    }
}
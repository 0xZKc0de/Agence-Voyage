package com.demo.backend.Controller;

import com.demo.backend.DTO.ReservationRequest;
import com.demo.backend.Entity.Reservation;
import com.demo.backend.Service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable int id) {
        try {
            Reservation cancelledRes = reservationService.cancelReservation(id);
            return ResponseEntity.ok(cancelledRes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateReservation(@PathVariable int id, @RequestBody ReservationRequest request) {
        try {
            Reservation updatedRes = reservationService.updateReservation(id, request);
            return ResponseEntity.ok(updatedRes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getReservationsCount() {
        return ResponseEntity.ok(reservationService.getReservationsCount());
    }


}
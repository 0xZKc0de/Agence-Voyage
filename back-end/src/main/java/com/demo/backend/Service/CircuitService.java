package com.demo.backend.Service;

import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Circuit;
import com.demo.backend.Entity.Reservation;
import com.demo.backend.Repository.CircuitRepository;
import com.demo.backend.Repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CircuitService {

     private CircuitRepository circuitRepository;

     public CircuitService(ReservationRepository reservationRepository) {
         this.circuitRepository = circuitRepository;
     }

     public List<Circuit> findAll() {
         return circuitRepository.findAll();
     }

     public List<Circuit> findByDistination(String distination) {
         return circuitRepository.findByDistination(distination);
     }

}

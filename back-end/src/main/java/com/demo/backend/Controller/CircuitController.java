package com.demo.backend.Controller;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Service.CircuitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/circuits")
@CrossOrigin("*")
public class CircuitController {

    @Autowired
    private CircuitService circuitService;

    @GetMapping
    public List<Circuit> findAll() {
        return circuitService.findAll();
    }

    @GetMapping("/{destination}")
    public List<Circuit> findByDestination(@PathVariable String destination) {
        return circuitService.findByDistination(destination);
    }

    // Add Circuit
    @PostMapping("/add")
    public ResponseEntity<Circuit> addCircuit(@RequestBody Circuit circuit) {
        return ResponseEntity.ok(circuitService.addCircuit(circuit));
    }

    // Update Circuit
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCircuit(@PathVariable int id, @RequestBody Circuit circuit) {
        try {
            return ResponseEntity.ok(circuitService.updateCircuit(id, circuit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Circuit
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCircuit(@PathVariable int id) {
        try {
            circuitService.deleteCircuit(id);
            return ResponseEntity.ok("Circuit deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
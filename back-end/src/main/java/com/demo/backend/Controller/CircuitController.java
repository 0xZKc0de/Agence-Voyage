package com.demo.backend.Controller;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Service.CircuitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/circuits")
@CrossOrigin("*")
public class CircuitController {

    @Autowired
    private CircuitService circuitService;

    @GetMapping
    public ResponseEntity<Page<Circuit>> getAllCircuits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        return ResponseEntity.ok(circuitService.getAllCircuits(page, size));
    }

    @GetMapping("/all")
    public List<Circuit> getAllCircuitsList() {
        return circuitService.findAll();
    }

    @GetMapping("/destinations")
    public List<String> getDestinations() {
        return circuitService.getUniqueDestinations();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Circuit> getCircuitById(@PathVariable int id) {
        return circuitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/{destination}")
    public List<Circuit> findByDestination(@PathVariable String destination) {
        return circuitService.findByDistination(destination);
    }

    @PostMapping("/add")
    public ResponseEntity<Circuit> addCircuit(@RequestBody Circuit circuit) {
        return ResponseEntity.ok(circuitService.addCircuit(circuit));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCircuit(@PathVariable int id, @RequestBody Circuit circuit) {
        try {
            return ResponseEntity.ok(circuitService.updateCircuit(id, circuit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteCircuit(@PathVariable int id) {
        try {
            circuitService.deleteCircuit(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCircuitsCount() {
        long count = circuitService.getCircuitsCount();
        return ResponseEntity.ok(count);
    }


}
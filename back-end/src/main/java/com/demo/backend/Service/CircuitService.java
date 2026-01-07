package com.demo.backend.Service;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Repository.CircuitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CircuitService {

    @Autowired
    private CircuitRepository circuitRepository;

    public List<Circuit> findAll() {
        return circuitRepository.findAll();
    }

    public List<Circuit> findByDistination(String distination) {
        return circuitRepository.findByDistination(distination);
    }

    // 1. Add new Circuit
    public Circuit addCircuit(Circuit circuit) {
        return circuitRepository.save(circuit);
    }

    // 2. Update existing Circuit
    public Circuit updateCircuit(int id, Circuit circuitDetails) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with id: " + id));

        circuit.setDistination(circuitDetails.getDistination());
        circuit.setPrix(circuitDetails.getPrix());
        circuit.setDateDepart(circuitDetails.getDateDepart());
        circuit.setDateArrive(circuitDetails.getDateArrive());

        return circuitRepository.save(circuit);
    }

    // 3. Remove Circuit
    public void deleteCircuit(int id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with id: " + id));
        circuitRepository.delete(circuit);
    }

    public List<String> getUniqueDestinations() {
        return circuitRepository.findDistinctDestinations();
    }
}
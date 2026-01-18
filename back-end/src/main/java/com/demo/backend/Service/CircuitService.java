package com.demo.backend.Service;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Repository.CircuitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CircuitService {

    @Autowired
    private CircuitRepository circuitRepository;

    // جلب جميع الرحلات
    public List<Circuit> findAll() {
        return circuitRepository.findAll();
    }

    // جلب رحلة محددة بواسطة الـ ID
    public Optional<Circuit> findById(int id) {
        return circuitRepository.findById(id);
    }

    // البحث حسب الوجهة
    public List<Circuit> findByDistination(String distination) {
        return circuitRepository.findByDistination(distination);
    }

    // جلب قائمة الوجهات الفريدة (بدون تكرار)
    public List<String> getUniqueDestinations() {
        return circuitRepository.findAll()
                .stream()
                .map(Circuit::getDistination)
                .distinct()
                .toList();
    }


    public Circuit addCircuit(Circuit circuit) {
        return circuitRepository.save(circuit);
    }


    public Circuit updateCircuit(int id, Circuit circuitDetails) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with id: " + id));

        circuit.setDistination(circuitDetails.getDistination());
        circuit.setPrix(circuitDetails.getPrix());
        circuit.setDateDepart(circuitDetails.getDateDepart());
        circuit.setDateArrive(circuitDetails.getDateArrive());
        circuit.setDescription(circuitDetails.getDescription());
        circuit.setImageUrl(circuitDetails.getImageUrl());

        return circuitRepository.save(circuit);
    }


    public void deleteCircuit(int id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with id: " + id));
        circuitRepository.delete(circuit);
    }

    public long getCircuitsCount() {
        return circuitRepository.count();
    }
}
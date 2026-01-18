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

    // جلب جميع الرحلات
    @GetMapping
    public List<Circuit> findAll() {
        return circuitService.findAll();
    }

    // جلب قائمة الوجهات للفلاتر
    @GetMapping("/destinations")
    public List<String> getDestinations() {
        return circuitService.getUniqueDestinations();
    }

    // جلب رحلة واحدة بواسطة الـ ID (الذي طلبته)
    @GetMapping("/get/{id}")
    public ResponseEntity<Circuit> getCircuitById(@PathVariable int id) {
        return circuitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // البحث حسب الوجهة (تم تحديث المسار لتجنب التضارب)
    @GetMapping("/search/{destination}")
    public List<Circuit> findByDestination(@PathVariable String destination) {
        return circuitService.findByDistination(destination);
    }

    // إضافة رحلة
    @PostMapping("/add")
    public ResponseEntity<Circuit> addCircuit(@RequestBody Circuit circuit) {
        return ResponseEntity.ok(circuitService.addCircuit(circuit));
    }

    // تحديث رحلة
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCircuit(@PathVariable int id, @RequestBody Circuit circuit) {
        try {
            return ResponseEntity.ok(circuitService.updateCircuit(id, circuit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // حذف رحلة
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCircuit(@PathVariable int id) {
        try {
            circuitService.deleteCircuit(id);
            return ResponseEntity.ok("Circuit deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCircuitsCount() {
        long count = circuitService.getCircuitsCount();
        return ResponseEntity.ok(count);
    }


}
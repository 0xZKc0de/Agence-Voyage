package com.demo.backend.Service;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Repository.CircuitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CircuitServiceTest {

    @Mock
    private CircuitRepository circuitRepository;

    @InjectMocks
    private CircuitService circuitService;

    private Circuit circuit1;
    private Circuit circuit2;

    @BeforeEach
    void setUp() {
        circuit1 = new Circuit();
        circuit1.setId(1);
        circuit1.setDistination("Paris");
        circuit1.setPrix(1200.0);

        circuit2 = new Circuit();
        circuit2.setId(2);
        circuit2.setDistination("Madrid");
        circuit2.setPrix(800.0);
    }

    @Test
    void testGetAllCircuits_Success() {
        Page<Circuit> page = new PageImpl<>(List.of(circuit1, circuit2));
        when(circuitRepository.findAll(any(Pageable.class))).thenReturn(page);

        Page<Circuit> result = circuitService.getAllCircuits(0, 5);

        assertEquals(2, result.getTotalElements());
    }

    @Test
    void testFindById_WhenNotFound_ShouldReturnEmpty() {
        when(circuitRepository.findById(99)).thenReturn(Optional.empty());

        Optional<Circuit> result = circuitService.findById(99);

        assertTrue(result.isEmpty());
    }

    @Test
    void testGetUniqueDestinations_ShouldRemoveDuplicates() {
        Circuit circuit3 = new Circuit();
        circuit3.setDistination("Paris");
        when(circuitRepository.findAll()).thenReturn(Arrays.asList(circuit1, circuit2, circuit3));

        List<String> destinations = circuitService.getUniqueDestinations();

        assertEquals(2, destinations.size());
        assertTrue(destinations.contains("Paris"));
        assertTrue(destinations.contains("Madrid"));
    }


    @Test
    void testDeleteCircuit_WhenNotFound_ShouldThrowException() {
        when(circuitRepository.findById(99)).thenReturn(Optional.empty());

        // التصحيح: نستخدم assertThrows لنقول للاختبار "توقع حدوث خطأ"
        assertThrows(RuntimeException.class, () -> {
            circuitService.deleteCircuit(99);
        });
    }

    @Test
    void testUpdateCircuit_Success() {
        Circuit newDetails = new Circuit();
        newDetails.setDistination("London");
        newDetails.setPrix(5000.0);

        when(circuitRepository.findById(1)).thenReturn(Optional.of(circuit1));
        when(circuitRepository.save(circuit1)).thenReturn(circuit1);

        Circuit updated = circuitService.updateCircuit(1, newDetails);

        assertEquals(5000.0, updated.getPrix());
    }
}
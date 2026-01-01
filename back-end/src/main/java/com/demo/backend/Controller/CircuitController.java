package com.demo.backend.Controller;


import com.demo.backend.Entity.Circuit;
import com.demo.backend.Service.CircuitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1")
public class CircuitController {

    private CircuitService circuitService;

    @GetMapping("/circuits")
    public List<Circuit> findAll() {
        return circuitService.findAll();
    }

    @GetMapping("/circuits/{destination}")
    public List<Circuit> findByDestination(@PathVariable String destination) {
        return circuitService.findByDistination(destination);
    }


}

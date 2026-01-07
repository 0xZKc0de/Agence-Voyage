package com.demo.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    // Chifae
    @GetMapping("/")
    public String home() {
        return "Hello World!";
    }
}
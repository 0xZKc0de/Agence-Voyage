package com.demo.backend.Controller;

import com.demo.backend.Service.PaypalService;
import com.paypal.orders.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin("*")
public class PaypalController {

    @Autowired
    private PaypalService paypalService;

    @PostMapping("/create/{reservationId}")
    public String createPayment(@PathVariable int reservationId) throws IOException {
        Order order = paypalService.createOrder(reservationId);
        return order.links().stream()
                .filter(link -> link.rel().equals("approve"))
                .findFirst()
                .orElseThrow()
                .href();
    }

    @PostMapping("/capture/{orderId}/{reservationId}")
    public ResponseEntity<?> capturePayment(@PathVariable String orderId, @PathVariable int reservationId) {
        try {
            paypalService.captureOrder(orderId, reservationId);
            return ResponseEntity.ok("Payment Successful and Database Updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
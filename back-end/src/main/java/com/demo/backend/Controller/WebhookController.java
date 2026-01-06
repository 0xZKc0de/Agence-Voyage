package com.demo.backend.Controller;


import com.demo.backend.Entity.Payment;
import com.demo.backend.Entity.Reservation;
import com.demo.backend.Repository.PaymentRepository;
import com.demo.backend.Repository.ReservationRepository;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/stripe")
    public ResponseEntity<String> handle(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("فشل التوثيق");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
            processSuccessfulPayment(intent);
        }

        return ResponseEntity.ok("تمت المعالجة");
    }

    @Transactional
    private void processSuccessfulPayment(PaymentIntent intent) {
        int resId = Integer.parseInt(intent.getMetadata().get("reservationId"));
        Reservation res = reservationRepository.findById(resId).get();

        // 1. تحديث حالة الحجز في كيان Reservation
        res.setStatus("PAID");
        reservationRepository.save(res);

        // 2. إنشاء سجل دفع جديد في كيان Payment
        Payment payment = new Payment();
        payment.setReservation(res);
        payment.setMontant(intent.getAmount() / 100.0);
        payment.setDatePaiement(new Date());
        payment.setModePaiement("Card (" + intent.getPaymentMethod() + ")");
        payment.setStatut("SUCCESS");

        paymentRepository.save(payment);
    }
}
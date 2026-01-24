package com.demo.backend.Service;

import com.demo.backend.Entity.Payment;
import com.demo.backend.Entity.Reservation;
import com.demo.backend.Repository.PaymentRepository;
import com.demo.backend.Repository.ReservationRepository;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.Locale;

@Service
public class PaypalService {

    @Autowired
    private PayPalHttpClient payPalHttpClient;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public Order createOrder(int reservationId) throws IOException {
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + reservationId));

        double total = res.getNbPersons() * res.getCircuit().getPrix();

        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        AmountWithBreakdown amount = new AmountWithBreakdown()
                .currencyCode("DH")
                .value(String.format(Locale.US, "%.2f", total));

        PurchaseUnitRequest purchaseUnitRequest = new PurchaseUnitRequest().amountWithBreakdown(amount);
        orderRequest.purchaseUnits(Collections.singletonList(purchaseUnitRequest));

        ApplicationContext applicationContext = new ApplicationContext()
                .returnUrl("http://localhost:4200/payment/success?resId=" + reservationId)
                .cancelUrl("http://localhost:4200/payment/cancel");
        orderRequest.applicationContext(applicationContext);

        OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);
        return payPalHttpClient.execute(request).result();
    }

    @Transactional
    public void captureOrder(String orderId, int reservationId) throws IOException {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        HttpResponse<Order> response = payPalHttpClient.execute(request);

        if (response.result().status().equals("COMPLETED")) {

            Reservation res = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found for payment capture. ID: " + reservationId));

            res.setStatus("PAID");
            reservationRepository.save(res);

            Payment payment = new Payment();
            payment.setReservation(res);
            payment.setMontant(res.getNbPersons() * res.getCircuit().getPrix());
            payment.setDatePaiement(new Date());
            payment.setModePaiement("PAYPAL");
            payment.setStatut("SUCCESS");

            paymentRepository.save(payment);
        }
    }
}
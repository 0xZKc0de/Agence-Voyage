package com.demo.backend.Service;

import com.demo.backend.Entity.Reservation;
import com.demo.backend.Repository.ReservationRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Autowired
    private ReservationRepository reservationRepository;

    public String createPaymentIntent(int reservationId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // 1. التحقق من وجود الحجز في قاعدة البيانات
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // 2. حساب المبلغ الإجمالي (السعر × عدد الأشخاص)
        // Stripe يحسب بالسنت (مثلاً 100.00 دولار ترسل كـ 10000)
        long totalAmount = (long) (reservation.getNbPersons() * reservation.getCircuit().getPrix() * 100);

        // 3. إعداد بارامترات Stripe
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(totalAmount)
                .setCurrency("usd") // أو "eur" حسب مشروعك
                .putMetadata("reservationId", String.valueOf(reservationId)) // لربط العملية لاحقاً في الـ Webhook
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        // 4. إنشاء الـ Intent في خوادم Stripe
        PaymentIntent intent = PaymentIntent.create(params);

        // 5. إعادة الـ Client Secret للـ Angular
        return intent.getClientSecret();
    }
}
package com.demo.backend.Service;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Entity.Payment;
import com.demo.backend.Entity.Reservation;
import com.demo.backend.Repository.PaymentRepository;
import com.demo.backend.Repository.ReservationRepository;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaypalServiceTest {

    @Mock
    private PayPalHttpClient payPalHttpClient;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaypalService paypalService;

    private Reservation reservation;
    private Circuit circuit;

    @BeforeEach
    void setUp() {
        circuit = new Circuit();
        circuit.setPrix(100.0);

        reservation = new Reservation();
        reservation.setId(1);
        reservation.setNbPersons(2);
        reservation.setCircuit(circuit);
        reservation.setStatus("PENDING");
    }

    // ==========================================
    // 1. الحالة الطبيعية (Happy Path) - يجب أن تنجح
    // ==========================================
    @Test
    void shouldCaptureOrderSuccessfully_WhenDataIsCorrect() throws IOException {
        // Arrange
        Order fakeOrder = mock(Order.class);
        when(fakeOrder.status()).thenReturn("COMPLETED");
        HttpResponse<Order> httpResponse = mock(HttpResponse.class);
        when(httpResponse.result()).thenReturn(fakeOrder);

        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(httpResponse);
        when(reservationRepository.findById(1)).thenReturn(Optional.of(reservation));

        // Act
        paypalService.captureOrder("ORDER-123", 1);

        // Assert
        assertEquals("PAID", reservation.getStatus());
        verify(paymentRepository).save(any(Payment.class));
    }

    // ==========================================
    // 2. حالة الخطأ المتوقع (Exception Case) - يجب أن تنجح أيضاً
    // ==========================================
    @Test
    void shouldThrowRuntimeException_WhenReservationNotFound() throws IOException {
        // Arrange
        Order fakeOrder = mock(Order.class);
        when(fakeOrder.status()).thenReturn("COMPLETED");
        HttpResponse<Order> httpResponse = mock(HttpResponse.class);
        when(httpResponse.result()).thenReturn(fakeOrder);

        when(payPalHttpClient.execute(any(OrdersCaptureRequest.class))).thenReturn(httpResponse);

        // محاكاة أن الحجز غير موجود
        when(reservationRepository.findById(99)).thenReturn(Optional.empty());

        // Act & Assert
        // هنا نقول للاختبار: "توقع حدوث RuntimeException، وافحص الرسالة بداخله"
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paypalService.captureOrder("ORDER-123", 99);
        });

        // التحقق من أن الرسالة هي الرسالة الصحيحة التي كتبناها في الكود
        assertTrue(exception.getMessage().contains("Reservation not found"));
    }
}
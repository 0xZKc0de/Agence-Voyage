package com.demo.backend.Service;

import com.demo.backend.DTO.ReservationRequest;
import com.demo.backend.Entity.*;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.CircuitRepository;
import com.demo.backend.Repository.ClientRepository;
import com.demo.backend.Repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private CircuitRepository circuitRepository;
    @Mock
    private AdminRepository adminRepository;
    @Mock
    private ClientRepository clientRepository;

    // لموكات السكيورتي (محاكاة تسجيل الدخول)
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private ReservationService reservationService;

    // دالة مساعدة لضبط المستخدم المسجل حالياً قبل الاختبارات التي تحتاجه
    private void setupSecurityContext(String email) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        SecurityContextHolder.setContext(securityContext);
    }

    // =========================
    // initiateReservation
    // =========================

    @Test
    void shouldInitiateReservationSuccessfully() {
        // 1. تجهيز البيانات
        ReservationRequest request = new ReservationRequest();
        request.setCircuitId(1);
        request.setNbPersons(2);

        Circuit circuit = new Circuit();
        circuit.setId(1);
        circuit.setNb_places(10); // متوفر 10 أماكن
        circuit.setPrix(100.0);

        Admin admin = new Admin();
        admin.setId(1);

        Client client = new Client();
        client.setEmail("client@test.com");

        // 2. ضبط الموكات (Mocks)
        when(circuitRepository.findById(1)).thenReturn(Optional.of(circuit));
        when(adminRepository.findById(1)).thenReturn(Optional.of(admin));

        // محاكاة السكيورتي
        setupSecurityContext("client@test.com");
        when(clientRepository.findByEmail("client@test.com")).thenReturn(Optional.of(client));

        // عندما يتم حفظ الحجز، أعد نفس الكائن
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

        // 3. التنفيذ
        Reservation result = reservationService.initiateReservation(request);

        // 4. التحقق (Assertions)
        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals(2, result.getNbPersons());
        // التأكد من نقص عدد الأماكن (10 - 2 = 8)
        assertEquals(8, circuit.getNb_places());

        // التأكد من حفظ تحديث الرحلة وحفظ الحجز
        verify(circuitRepository).save(circuit);
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void shouldThrowExceptionWhenNotEnoughPlaces() {
        ReservationRequest request = new ReservationRequest();
        request.setCircuitId(1);
        request.setNbPersons(5);

        Circuit circuit = new Circuit();
        circuit.setId(1);
        circuit.setNb_places(2); // يوجد فقط مكانين

        when(circuitRepository.findById(1)).thenReturn(Optional.of(circuit));

        // التحقق من رمي الخطأ
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> reservationService.initiateReservation(request));

        assertTrue(ex.getMessage().contains("Not enough places available"));
        // التأكد من عدم حفظ أي شيء
        verify(reservationRepository, never()).save(any());
    }

    // =========================
    // cancelReservation
    // =========================

    @Test
    void shouldCancelReservationAndRestorePlaces() {
        // تجهيز حجز موجود
        Circuit circuit = new Circuit();
        circuit.setNb_places(10);

        Reservation reservation = new Reservation();
        reservation.setId(1);
        reservation.setStatus("PENDING");
        reservation.setNbPersons(3);
        reservation.setCircuit(circuit);

        when(reservationRepository.findById(1)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

        // التنفيذ
        Reservation result = reservationService.cancelReservation(1);

        // التحقق
        assertEquals("CANCELLED", result.getStatus());
        // التأكد من استرجاع الأماكن (10 + 3 = 13)
        assertEquals(13, circuit.getNb_places());

        verify(circuitRepository).save(circuit);
    }

    @Test
    void shouldThrowExceptionIfAlreadyCancelled() {
        Reservation reservation = new Reservation();
        reservation.setId(1);
        reservation.setStatus("CANCELLED");

        when(reservationRepository.findById(1)).thenReturn(Optional.of(reservation));

        assertThrows(RuntimeException.class,
                () -> reservationService.cancelReservation(1));
    }

    // =========================
    // updateReservation
    // =========================

    @Test
    void shouldUpdateReservationSuccessfully() {
        ReservationRequest request = new ReservationRequest();
        request.setNbPersons(5); // تغيير العدد من 2 إلى 5

        Reservation existingRes = new Reservation();
        existingRes.setId(1);
        existingRes.setStatus("PENDING");
        existingRes.setNbPersons(2);

        when(reservationRepository.findById(1)).thenReturn(Optional.of(existingRes));
        when(reservationRepository.save(existingRes)).thenReturn(existingRes);

        Reservation result = reservationService.updateReservation(1, request);

        assertEquals(5, result.getNbPersons());
        assertNotNull(result.getDateReservation()); // التأكد من تحديث التاريخ
    }

    @Test
    void shouldFailUpdateIfNotPending() {
        ReservationRequest request = new ReservationRequest();
        Reservation existingRes = new Reservation();
        existingRes.setStatus("PAID"); // ليس PENDING

        when(reservationRepository.findById(1)).thenReturn(Optional.of(existingRes));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> reservationService.updateReservation(1, request));

        assertTrue(ex.getMessage().contains("Only PENDING reservations can be modified"));
    }

    // =========================
    // getTotalRevenue
    // =========================

    @Test
    void shouldCalculateTotalRevenue() {
        // الرحلة الأولى
        Circuit c1 = new Circuit();
        c1.setPrix(100.0);
        Reservation r1 = new Reservation();
        r1.setCircuit(c1);
        r1.setNbPersons(2); // 2 * 100 = 200

        // الرحلة الثانية
        Circuit c2 = new Circuit();
        c2.setPrix(50.0);
        Reservation r2 = new Reservation();
        r2.setCircuit(c2);
        r2.setNbPersons(3); // 3 * 50 = 150

        // حجز بدون رحلة (للتأكد من تجاهله كما في الكود)
        Reservation r3 = new Reservation();
        r3.setCircuit(null);

        when(reservationRepository.findAll()).thenReturn(Arrays.asList(r1, r2, r3));

        double revenue = reservationService.getTotalRevenue();

        // 200 + 150 = 350
        assertEquals(350.0, revenue);
    }

    // =========================
    // getMyReservations
    // =========================

    @Test
    void shouldReturnMyReservations() {
        String email = "me@test.com";
        setupSecurityContext(email);

        Reservation r1 = new Reservation();
        when(reservationRepository.findByClientEmail(email)).thenReturn(List.of(r1));

        List<Reservation> result = reservationService.getMyReservations();

        assertEquals(1, result.size());
        verify(reservationRepository).findByClientEmail(email);
    }
}
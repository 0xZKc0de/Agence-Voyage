package com.demo.backend.Repository;

import com.demo.backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CircuitRepository extends JpaRepository<Payment, Integer> {
}

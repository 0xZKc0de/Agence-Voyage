package com.demo.backend.Repository;

import com.demo.backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Payment, Integer> {
}

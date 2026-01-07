package com.demo.backend.Repository;

import com.demo.backend.Entity.Admin;
import com.demo.backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    public Optional<Admin> findById(int id);
    public Optional<Admin> findByEmail(String email);
}

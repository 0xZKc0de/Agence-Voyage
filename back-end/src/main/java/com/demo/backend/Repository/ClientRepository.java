package com.demo.backend.Repository;

import com.demo.backend.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    public Optional<Client> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}

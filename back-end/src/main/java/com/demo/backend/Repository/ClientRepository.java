package com.demo.backend.Repository;

import com.demo.backend.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    public Optional<Client> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    @Query("SELECT c FROM Client c ORDER BY SIZE(c.reservations) DESC")
    List<Client> findTopClients(org.springframework.data.domain.Pageable pageable);

}

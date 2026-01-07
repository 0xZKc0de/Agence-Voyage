package com.demo.backend.Repository;

import com.demo.backend.Entity.Circuit;
import com.demo.backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CircuitRepository extends JpaRepository<Circuit, Integer> {

    public List<Circuit> findByDistination(String distination);

    @Query("SELECT DISTINCT c.distination FROM Circuit c")
    List<String> findDistinctDestinations();
}

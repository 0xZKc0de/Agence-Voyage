package com.demo.backend.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data @NoArgsConstructor
@AllArgsConstructor
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private Date date;

    @Column(nullable = false)
    private int nbPersons;

    @Column(nullable = false)
    public String status;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
    @JsonIgnore
    private Payment payment;

    @ManyToOne
    @JoinColumn(name = "circuit_id")
    private Circuit circuit;

}

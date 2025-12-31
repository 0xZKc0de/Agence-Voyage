package com.demo.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data @NoArgsConstructor
@AllArgsConstructor
@Table(name = "paiement")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private Date datePaiement;

    @Column(nullable = false)
    private double montant;

    @Column(nullable = false)
    private String modePaiement;

    @Column(nullable = false)
    private String statut;


    @OneToOne
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    private Reservation reservation;

}
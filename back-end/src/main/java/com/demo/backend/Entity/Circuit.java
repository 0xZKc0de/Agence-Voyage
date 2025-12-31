package com.demo.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data @NoArgsConstructor
@AllArgsConstructor
@Table(name = "circuit")
public class Circuit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String distination;

    @Column(nullable = false)
    private Date dateDepart;

    @Column(nullable = false)
    private Date dateArrive;

    @Column(nullable = false)
    private double prix;

    @JsonIgnore
    @OneToMany(mappedBy = "circuit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

}

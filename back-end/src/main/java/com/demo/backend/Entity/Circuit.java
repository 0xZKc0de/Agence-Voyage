package com.demo.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
    private int nb_places;

    @Column(nullable = false)
    private Date dateArrive;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = true)
    private String imageUrl;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public long getDuration() {
        if (dateDepart != null && dateArrive != null) {
            long diffInMillies = Math.abs(dateArrive.getTime() - dateDepart.getTime());
            return TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
        }
        return 0;
    }

    @Column(nullable = false)
    private double prix;

    @JsonIgnore
    @OneToMany(mappedBy = "circuit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

}

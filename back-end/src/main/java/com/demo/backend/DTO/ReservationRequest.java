package com.demo.backend.DTO;


public class ReservationRequest {

    private int circuitId;
    private int nbPersons;
    // private int userId;

    public ReservationRequest() {}

    public ReservationRequest(int circuitId, int nbPersons) {
        this.circuitId = circuitId;
        this.nbPersons = nbPersons;
    }

    // Getters and Setters
    public int getCircuitId() {
        return circuitId;
    }

    public void setCircuitId(int circuitId) {
        this.circuitId = circuitId;
    }

    public int getNbPersons() {
        return nbPersons;
    }

    public void setNbPersons(int nbPersons) {
        this.nbPersons = nbPersons;
    }
}
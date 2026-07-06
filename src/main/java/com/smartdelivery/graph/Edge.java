package com.smartdelivery.graph;

/**
 * Represents a weighted connection between two location nodes.
 * The distance value is reserved for future route optimization algorithms.
 */
public class Edge {

    private LocationNode source;
    private LocationNode destination;
    private double distance;

    public Edge(LocationNode source, LocationNode destination, double distance) {
        this.source = source;
        this.destination = destination;
        this.distance = distance;
    }

    public LocationNode getSource() {
        return source;
    }

    public void setSource(LocationNode source) {
        this.source = source;
    }

    public LocationNode getDestination() {
        return destination;
    }

    public void setDestination(LocationNode destination) {
        this.destination = destination;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}

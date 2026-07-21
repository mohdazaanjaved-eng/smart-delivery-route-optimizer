package com.smartdelivery.graph;

import java.util.Objects;

/**
 * Represents a physical location in the route graph.
 * Each delivery address can be modeled as one node before route optimization is added.
 */
public class LocationNode {

    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;

    public LocationNode(Long id, String name, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (!(object instanceof LocationNode that)) {
            return false;
        }
        return Objects.equals(id, that.id)
                && Objects.equals(name, that.name)
                && Objects.equals(latitude, that.latitude)
                && Objects.equals(longitude, that.longitude);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, latitude, longitude);
    }

    @Override
    public String toString() {
        return "LocationNode{"
                + "id=" + id
                + ", name='" + name + '\''
                + ", latitude=" + latitude
                + ", longitude=" + longitude
                + '}';
    }
}

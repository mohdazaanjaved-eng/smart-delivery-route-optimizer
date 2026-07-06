package com.smartdelivery.util;

/**
 * Calculates geographical distance between coordinates.
 */
public final class DistanceCalculator {

    private static final double EARTH_RADIUS_KILOMETERS = 6371.0;

    private DistanceCalculator() {
    }

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double latitudeDistance = Math.toRadians(lat2 - lat1);
        double longitudeDistance = Math.toRadians(lon2 - lon1);

        double startLatitude = Math.toRadians(lat1);
        double endLatitude = Math.toRadians(lat2);

        double haversine = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2)
                + Math.cos(startLatitude) * Math.cos(endLatitude)
                * Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);

        double centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
        return EARTH_RADIUS_KILOMETERS * centralAngle;
    }
}

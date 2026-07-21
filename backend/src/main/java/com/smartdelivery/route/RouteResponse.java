package com.smartdelivery.route;

import lombok.Builder;

import java.util.List;

/**
 * Response payload for an optimized route.
 */
@Builder
public record RouteResponse(
        double totalDistance,
        int totalStops,
        List<RouteStepResponse> route
) {
}

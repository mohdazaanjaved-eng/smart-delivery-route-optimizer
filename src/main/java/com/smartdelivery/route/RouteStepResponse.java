package com.smartdelivery.route;

import lombok.Builder;

/**
 * Represents one stop in the optimized delivery route.
 */
@Builder
public record RouteStepResponse(
        int order,
        String customer,
        String address,
        Double latitude,
        Double longitude,
        double distanceFromPrevious
) {
}

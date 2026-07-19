package com.smartdelivery.dto;

import lombok.Builder;

@Builder
public record GraphEdgeResponse(
        String source,
        String destination,
        double distance
) {
}

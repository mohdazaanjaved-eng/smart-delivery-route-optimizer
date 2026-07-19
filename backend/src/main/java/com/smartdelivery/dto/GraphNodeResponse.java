package com.smartdelivery.dto;

import lombok.Builder;

@Builder
public record GraphNodeResponse(
        Long id,
        String name,
        Double latitude,
        Double longitude
) {
}

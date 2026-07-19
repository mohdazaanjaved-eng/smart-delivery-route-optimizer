package com.smartdelivery.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record GraphResponse(
        List<GraphNodeResponse> nodes,
        List<GraphEdgeResponse> edges
) {
}

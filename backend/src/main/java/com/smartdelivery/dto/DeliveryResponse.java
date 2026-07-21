package com.smartdelivery.dto;

import com.smartdelivery.entity.DeliveryPriority;
import com.smartdelivery.entity.DeliveryStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record DeliveryResponse(
        Long id,
        String customerName,
        String customerPhone,
        String customerEmail,
        String deliveryAddress,
        Double latitude,
        Double longitude,
        DeliveryPriority priority,
        DeliveryStatus status,
        LocalDateTime estimatedDeliveryTime,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime completedAt
) {
}

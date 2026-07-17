package com.smartdelivery.dto;

import com.smartdelivery.entity.DeliveryPriority;
import com.smartdelivery.entity.DeliveryStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateDeliveryRequest(
        @NotBlank(message = "Customer name is required")
        @Size(max = 100, message = "Customer name must not exceed 100 characters")
        String customerName,

        @NotBlank(message = "Customer phone is required")
        @Pattern(regexp = "^[0-9+()\\-\\s]{7,20}$", message = "Customer phone must be valid")
        String customerPhone,

        @NotBlank(message = "Customer email is required")
        @Email(message = "Customer email must be valid")
        @Size(max = 150, message = "Customer email must not exceed 150 characters")
        String customerEmail,

        @NotBlank(message = "Delivery address is required")
        @Size(max = 500, message = "Delivery address must not exceed 500 characters")
        String deliveryAddress,

        @NotNull(message = "Latitude is required")
        @DecimalMin(value = "-90.0", message = "Latitude must be greater than or equal to -90")
        @DecimalMax(value = "90.0", message = "Latitude must be less than or equal to 90")
        Double latitude,

        @NotNull(message = "Longitude is required")
        @DecimalMin(value = "-180.0", message = "Longitude must be greater than or equal to -180")
        @DecimalMax(value = "180.0", message = "Longitude must be less than or equal to 180")
        Double longitude,

        @NotNull(message = "Delivery priority is required")
        DeliveryPriority priority,

        DeliveryStatus status,

        @NotNull(message = "Estimated delivery time is required")
        @FutureOrPresent(message = "Estimated delivery time must be now or in the future")
        LocalDateTime estimatedDeliveryTime
) {
}

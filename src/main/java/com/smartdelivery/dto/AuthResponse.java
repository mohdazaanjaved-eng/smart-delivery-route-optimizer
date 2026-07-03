package com.smartdelivery.dto;

import com.smartdelivery.entity.Role;
import lombok.Builder;

@Builder
public record AuthResponse(
        Long userId,
        String fullName,
        String email,
        Role role,
        String message
) {
}

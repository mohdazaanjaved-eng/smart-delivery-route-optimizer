package com.smartdelivery.service.impl;

import com.smartdelivery.dto.AuthResponse;
import com.smartdelivery.dto.LoginRequest;
import com.smartdelivery.entity.Role;
import com.smartdelivery.entity.User;
import com.smartdelivery.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceImplLoginTests {

    @Test
    void logsInExistingUserWithMatchingPassword() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        UserServiceImpl userService = new UserServiceImpl(userRepository, passwordEncoder);
        User existingUser = User.builder()
                .id(10L)
                .fullName("Existing User")
                .email("existing@example.com")
                .password(passwordEncoder.encode("correct-password"))
                .role(Role.ADMIN)
                .build();
        when(userRepository.findByEmailIgnoreCase("existing@example.com"))
                .thenReturn(Optional.of(existingUser));

        AuthResponse response = userService.login(
                new LoginRequest(" Existing@Example.com ", "correct-password")
        );

        assertEquals(existingUser.getId(), response.userId());
        assertEquals(existingUser.getEmail(), response.email());
        assertEquals("Login successful", response.message());
    }
}

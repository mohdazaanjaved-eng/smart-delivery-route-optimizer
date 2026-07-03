package com.smartdelivery.service.impl;

import com.smartdelivery.dto.AuthResponse;
import com.smartdelivery.dto.LoginRequest;
import com.smartdelivery.dto.RegisterRequest;
import com.smartdelivery.entity.User;
import com.smartdelivery.exception.DuplicateResourceException;
import com.smartdelivery.exception.InvalidCredentialsException;
import com.smartdelivery.repository.UserRepository;
import com.smartdelivery.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber().trim())
                .role(request.role())
                .build();

        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser, "User registered successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return toAuthResponse(user, "Login successful");
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private AuthResponse toAuthResponse(User user, String message) {
        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .message(message)
                .build();
    }
}

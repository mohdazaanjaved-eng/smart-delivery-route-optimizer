package com.smartdelivery.service;

import com.smartdelivery.dto.AuthResponse;
import com.smartdelivery.dto.LoginRequest;
import com.smartdelivery.dto.RegisterRequest;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}

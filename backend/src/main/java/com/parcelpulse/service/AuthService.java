/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.service;

import com.parcelpulse.domain.User;
import com.parcelpulse.domain.enums.UserRole;
import com.parcelpulse.dto.LoginRequest;
import com.parcelpulse.dto.RegisterRequest;
import com.parcelpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .role(UserRole.valueOf(request.getRole().toUpperCase()))
                .active(true)
                .build();

        user = userRepository.save(user);
        auditService.log("USER", user.getId(), "REGISTERED", user.getEmail(), "New user registered as " + user.getRole());

        return buildUserResponse(user);
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        auditService.log("USER", user.getId(), "LOGIN", user.getEmail(), "User logged in");
        return buildUserResponse(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("role", user.getRole().name());
        response.put("active", user.getActive());
        return response;
    }
}

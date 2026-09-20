/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.controller;

import com.parcelpulse.domain.User;
import com.parcelpulse.domain.enums.UserRole;
import com.parcelpulse.dto.LoginRequest;
import com.parcelpulse.dto.RegisterRequest;
import com.parcelpulse.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(authService.getUsersByRole(UserRole.valueOf(role.toUpperCase())));
    }
}

/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("status", "UP", "service", "ParcelPulse API is running");
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "ParcelPulse API is healthy");
    }
}

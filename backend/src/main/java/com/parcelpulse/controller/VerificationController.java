/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.controller;

import com.parcelpulse.domain.VerificationResult;
import com.parcelpulse.dto.AdminDecisionRequest;
import com.parcelpulse.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @GetMapping("/placement/{placementId}")
    public ResponseEntity<VerificationResult> getByPlacement(@PathVariable Long placementId) {
        VerificationResult result = verificationService.getByPlacement(placementId);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/review-required")
    public ResponseEntity<List<VerificationResult>> getReviewRequired() {
        return ResponseEntity.ok(verificationService.getReviewRequired());
    }

    @PutMapping("/{id}/decide")
    public ResponseEntity<VerificationResult> adminDecision(
            @PathVariable Long id, @RequestBody AdminDecisionRequest request) {
        return ResponseEntity.ok(verificationService.adminDecision(id, request));
    }
}

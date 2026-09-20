/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.repository;

import com.parcelpulse.domain.VerificationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VerificationResultRepository extends JpaRepository<VerificationResult, Long> {
    Optional<VerificationResult> findByPlacementId(Long placementId);
    List<VerificationResult> findByOverallStatus(String status);
}

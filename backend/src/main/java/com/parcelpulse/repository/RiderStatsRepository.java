/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.repository;

import com.parcelpulse.domain.RiderStats;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RiderStatsRepository extends JpaRepository<RiderStats, Long> {
    Optional<RiderStats> findByRiderIdAndCampaignId(Long riderId, Long campaignId);
    List<RiderStats> findByRiderId(Long riderId);
    List<RiderStats> findByCampaignId(Long campaignId);
}

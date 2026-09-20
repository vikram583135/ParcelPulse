/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.repository;

import com.parcelpulse.domain.Reward;
import com.parcelpulse.domain.enums.RewardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByRiderId(Long riderId);
    List<Reward> findByCampaignId(Long campaignId);
    List<Reward> findByRiderIdAndCampaignId(Long riderId, Long campaignId);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Reward r WHERE r.riderId = ?1 AND r.status = ?2")
    BigDecimal sumAmountByRiderIdAndStatus(Long riderId, RewardStatus status);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Reward r WHERE r.riderId = ?1")
    BigDecimal sumAmountByRiderId(Long riderId);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Reward r WHERE r.campaignId = ?1")
    BigDecimal sumAmountByCampaignId(Long campaignId);
}

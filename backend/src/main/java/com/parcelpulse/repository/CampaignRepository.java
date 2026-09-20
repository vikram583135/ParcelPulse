/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.repository;

import com.parcelpulse.domain.Campaign;
import com.parcelpulse.domain.enums.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByAdvertiserId(Long advertiserId);
    List<Campaign> findByStatus(CampaignStatus status);
    long countByStatus(CampaignStatus status);
}

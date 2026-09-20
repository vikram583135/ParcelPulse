/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateCampaignRequest {
    private Long advertiserId;
    private String name;
    private String brandName;
    private String adDescription;
    private String targetArea;
    private Integer targetPlacements;
    private BigDecimal budget;
    private String paymentType; // FULL or PARTIAL
    private String campaignMode; // PLACEMENTS or BUDGET
    private String startDate;
    private String endDate;
}

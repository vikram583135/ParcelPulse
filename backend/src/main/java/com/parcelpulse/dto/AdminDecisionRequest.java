/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.dto;

import lombok.Data;

@Data
public class AdminDecisionRequest {
    private Long adminId;
    private String decision; // VERIFIED or REJECTED
    private String notes;
}

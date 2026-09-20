/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignStickersRequest {
    private Long agentId;
    private Long riderId;
    private List<Long> stickerIds;
}

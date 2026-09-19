package com.parcelpulse.dto;

import lombok.Data;

@Data
public class GenerateStickersRequest {
    private Long campaignId;
    private Integer quantity;
}

package com.parcelpulse.dto;

import lombok.Data;

@Data
public class IssueStickersRequest {
    private Long campaignId;
    private Long agentId;
    private Integer quantity;
}

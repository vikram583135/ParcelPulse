package com.parcelpulse.dto;

import lombok.Data;

@Data
public class AdminDecisionRequest {
    private Long adminId;
    private String decision; // VERIFIED or REJECTED
    private String notes;
}

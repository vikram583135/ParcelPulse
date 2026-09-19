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
    private String startDate;
    private String endDate;
}

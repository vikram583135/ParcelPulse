/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.domain;

import com.parcelpulse.domain.enums.CampaignStatus;
import com.parcelpulse.domain.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "advertiser_id", nullable = false)
    private Long advertiserId;

    @Column(nullable = false)
    private String name;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "ad_description", columnDefinition = "TEXT")
    private String adDescription;

    @Column(name = "target_area")
    private String targetArea;

    @Column(name = "target_placements")
    private Integer targetPlacements;

    @Column(precision = 12, scale = 2)
    private BigDecimal budget;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private PaymentType paymentType;

    @Column(name = "amount_paid", precision = 12, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "discount_applied", precision = 12, scale = 2)
    private BigDecimal discountApplied;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;

    @Column(name = "reward_per_placement", precision = 8, scale = 2)
    private BigDecimal rewardPerPlacement;

    @Column(name = "completion_bonus", precision = 8, scale = 2)
    private BigDecimal completionBonus;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = CampaignStatus.DRAFT;
    }
}

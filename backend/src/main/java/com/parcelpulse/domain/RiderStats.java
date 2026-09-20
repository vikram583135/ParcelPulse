/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rider_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RiderStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rider_id", nullable = false)
    private Long riderId;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "stickers_assigned")
    private Integer stickersAssigned = 0;

    @Column(name = "placements_submitted")
    private Integer placementsSubmitted = 0;

    @Column(name = "placements_verified")
    private Integer placementsVerified = 0;

    @Column(name = "placements_rejected")
    private Integer placementsRejected = 0;

    @Column(name = "total_earned", precision = 10, scale = 2)
    private BigDecimal totalEarned = BigDecimal.ZERO;

    @Column(name = "bonus_eligible")
    private Boolean bonusEligible = false;

    @Column(name = "bonus_paid")
    private Boolean bonusPaid = false;
}

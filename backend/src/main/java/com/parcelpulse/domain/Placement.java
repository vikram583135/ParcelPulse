/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.domain;

import com.parcelpulse.domain.enums.PlacementStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "placements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Placement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sticker_id", nullable = false)
    private Long stickerId;

    @Column(name = "rider_id", nullable = false)
    private Long riderId;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlacementStatus status;

    // Start evidence
    @Column(name = "start_photo_path")
    private String startPhotoPath;

    @Column(name = "start_latitude", precision = 10, scale = 7)
    private BigDecimal startLatitude;

    @Column(name = "start_longitude", precision = 10, scale = 7)
    private BigDecimal startLongitude;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "photo_hash_start")
    private String photoHashStart;

    // End evidence
    @Column(name = "end_photo_path")
    private String endPhotoPath;

    @Column(name = "end_latitude", precision = 10, scale = 7)
    private BigDecimal endLatitude;

    @Column(name = "end_longitude", precision = 10, scale = 7)
    private BigDecimal endLongitude;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "photo_hash_end")
    private String photoHashEnd;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = PlacementStatus.STARTED;
    }
}

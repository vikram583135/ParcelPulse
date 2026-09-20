/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.domain;

import com.parcelpulse.domain.enums.StickerStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stickers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Sticker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "sticker_code", nullable = false, unique = true)
    private String stickerCode;

    @Column(name = "qr_data")
    private String qrData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StickerStatus status;

    @Column(name = "current_agent_id")
    private Long currentAgentId;

    @Column(name = "current_rider_id")
    private Long currentRiderId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = StickerStatus.CREATED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.domain;

import com.parcelpulse.domain.enums.HandoverType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sticker_handovers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StickerHandover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sticker_id", nullable = false)
    private Long stickerId;

    @Column(name = "from_user_id")
    private Long fromUserId;

    @Column(name = "to_user_id", nullable = false)
    private Long toUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "handover_type", nullable = false)
    private HandoverType handoverType;

    @Column(name = "handover_time")
    private LocalDateTime handoverTime;

    @PrePersist
    protected void onCreate() {
        handoverTime = LocalDateTime.now();
    }
}

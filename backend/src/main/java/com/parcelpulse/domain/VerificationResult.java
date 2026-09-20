/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "placement_id", nullable = false)
    private Long placementId;

    @Column(name = "photo_check_passed")
    private Boolean photoCheckPassed;

    @Column(name = "gps_check_passed")
    private Boolean gpsCheckPassed;

    @Column(name = "time_check_passed")
    private Boolean timeCheckPassed;

    @Column(name = "duplicate_check_passed")
    private Boolean duplicateCheckPassed;

    @Column(name = "sticker_match_passed")
    private Boolean stickerMatchPassed;

    @Column(name = "overall_status")
    private String overallStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

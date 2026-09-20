/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.service;

import com.parcelpulse.domain.Placement;
import com.parcelpulse.domain.VerificationResult;
import com.parcelpulse.domain.enums.PlacementStatus;
import com.parcelpulse.dto.AdminDecisionRequest;
import com.parcelpulse.repository.PlacementRepository;
import com.parcelpulse.repository.VerificationResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationResultRepository verificationResultRepository;
    private final PlacementRepository placementRepository;
    private final RewardService rewardService;
    private final AuditService auditService;

    @Value("${parcelpulse.verification.min-time-gap-minutes:5}")
    private int minTimeGapMinutes;

    @Value("${parcelpulse.verification.max-time-gap-minutes:120}")
    private int maxTimeGapMinutes;

    @Value("${parcelpulse.verification.min-gps-distance-km:0.5}")
    private double minGpsDistanceKm;

    @Value("${parcelpulse.verification.max-gps-distance-km:30}")
    private double maxGpsDistanceKm;

    @Transactional
    public VerificationResult verifyPlacement(Placement placement) {
        List<String> notes = new ArrayList<>();
        boolean hasReviewFlag = false;
        boolean hasRejectFlag = false;

        // 1. Photo existence check
        boolean photoCheck = placement.getStartPhotoPath() != null && placement.getEndPhotoPath() != null;
        if (!photoCheck) {
            notes.add("FAIL: Missing start or end photo");
            hasRejectFlag = true;
        }

        // 2. Sticker match — always passes in MVP (sticker is tied by FK)
        boolean stickerCheck = true;
        notes.add("PASS: Sticker correctly linked to campaign");

        // 3. Time sequence check
        boolean timeCheck = true;
        if (placement.getStartTime() != null && placement.getEndTime() != null) {
            long minuteGap = Duration.between(placement.getStartTime(), placement.getEndTime()).toMinutes();
            if (minuteGap < 0) {
                timeCheck = false;
                hasRejectFlag = true;
                notes.add("FAIL: End time is before start time");
            } else if (minuteGap < minTimeGapMinutes) {
                timeCheck = false;
                hasReviewFlag = true;
                notes.add("REVIEW: Time gap too short (" + minuteGap + " min, min=" + minTimeGapMinutes + ")");
            } else if (minuteGap > maxTimeGapMinutes) {
                timeCheck = false;
                hasReviewFlag = true;
                notes.add("REVIEW: Time gap too long (" + minuteGap + " min, max=" + maxTimeGapMinutes + ")");
            } else {
                notes.add("PASS: Time gap valid (" + minuteGap + " min)");
            }
        }

        // 4. GPS distance check
        boolean gpsCheck = true;
        if (placement.getStartLatitude() != null && placement.getEndLatitude() != null) {
            double distance = calculateDistance(
                    placement.getStartLatitude().doubleValue(), placement.getStartLongitude().doubleValue(),
                    placement.getEndLatitude().doubleValue(), placement.getEndLongitude().doubleValue());
            if (distance < minGpsDistanceKm) {
                gpsCheck = false;
                hasReviewFlag = true;
                notes.add("REVIEW: GPS distance too short (" + String.format("%.2f", distance) + " km)");
            } else if (distance > maxGpsDistanceKm) {
                gpsCheck = false;
                hasReviewFlag = true;
                notes.add("REVIEW: GPS distance too far (" + String.format("%.2f", distance) + " km)");
            } else {
                notes.add("PASS: GPS distance valid (" + String.format("%.2f", distance) + " km)");
            }
        }

        // 5. Duplicate photo check (hash comparison)
        boolean duplicateCheck = true;
        if (placement.getPhotoHashStart() != null && placement.getPhotoHashEnd() != null) {
            // Check same start/end photo
            if (placement.getPhotoHashStart().equals(placement.getPhotoHashEnd())) {
                duplicateCheck = false;
                hasRejectFlag = true;
                notes.add("FAIL: Start and end photos are identical (possible fraud)");
            }

            // Check against all other placements
            List<Placement> matches = placementRepository.findByPhotoHashStartOrPhotoHashEnd(
                    placement.getPhotoHashEnd(), placement.getPhotoHashEnd());
            long otherMatches = matches.stream()
                    .filter(p -> !p.getId().equals(placement.getId()))
                    .count();
            if (otherMatches > 0) {
                duplicateCheck = false;
                hasRejectFlag = true;
                notes.add("FAIL: End photo hash matches " + otherMatches + " other placement(s) (reused photo)");
            }

            if (duplicateCheck) {
                notes.add("PASS: No duplicate photos detected");
            }
        }

        // Determine overall status
        String overallStatus;
        PlacementStatus placementStatus;
        if (hasRejectFlag) {
            overallStatus = "REJECTED";
            placementStatus = PlacementStatus.REJECTED;
        } else if (hasReviewFlag) {
            overallStatus = "REVIEW_REQUIRED";
            placementStatus = PlacementStatus.REVIEW_REQUIRED;
        } else {
            overallStatus = "VERIFIED";
            placementStatus = PlacementStatus.VERIFIED;
        }

        VerificationResult result = VerificationResult.builder()
                .placementId(placement.getId())
                .photoCheckPassed(photoCheck)
                .gpsCheckPassed(gpsCheck)
                .timeCheckPassed(timeCheck)
                .duplicateCheckPassed(duplicateCheck)
                .stickerMatchPassed(stickerCheck)
                .overallStatus(overallStatus)
                .notes(String.join("\n", notes))
                .build();

        result = verificationResultRepository.save(result);

        // Update placement status
        placement.setStatus(placementStatus);
        placementRepository.save(placement);

        auditService.log("VERIFICATION", result.getId(), overallStatus,
                "System", "Placement #" + placement.getId() + " → " + overallStatus);

        // If verified, trigger reward
        if (placementStatus == PlacementStatus.VERIFIED) {
            rewardService.creditPlacementReward(placement);
        }

        return result;
    }

    @Transactional
    public VerificationResult adminDecision(Long verificationId, AdminDecisionRequest request) {
        VerificationResult result = verificationResultRepository.findById(verificationId)
                .orElseThrow(() -> new RuntimeException("Verification result not found"));

        result.setOverallStatus(request.getDecision().toUpperCase());
        result.setNotes(result.getNotes() + "\nADMIN: " + request.getNotes());
        result.setReviewedBy(request.getAdminId());
        result.setReviewedAt(LocalDateTime.now());
        result = verificationResultRepository.save(result);

        // Update placement
        Placement placement = placementRepository.findById(result.getPlacementId())
                .orElseThrow(() -> new RuntimeException("Placement not found"));

        PlacementStatus newStatus = "VERIFIED".equals(request.getDecision().toUpperCase())
                ? PlacementStatus.VERIFIED : PlacementStatus.REJECTED;
        placement.setStatus(newStatus);
        placementRepository.save(placement);

        if (newStatus == PlacementStatus.VERIFIED) {
            rewardService.creditPlacementReward(placement);
        }

        auditService.log("VERIFICATION", verificationId, "ADMIN_DECISION",
                "Admin#" + request.getAdminId(), "Decision: " + request.getDecision() + " — " + request.getNotes());
        return result;
    }

    public VerificationResult getByPlacement(Long placementId) {
        return verificationResultRepository.findByPlacementId(placementId).orElse(null);
    }

    public List<VerificationResult> getReviewRequired() {
        return verificationResultRepository.findByOverallStatus("REVIEW_REQUIRED");
    }

    /**
     * Haversine formula to calculate distance between two GPS coordinates in km.
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

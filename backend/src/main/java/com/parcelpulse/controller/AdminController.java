/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.controller;

import com.parcelpulse.domain.enums.*;
import com.parcelpulse.repository.*;
import com.parcelpulse.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CampaignRepository campaignRepository;
    private final StickerRepository stickerRepository;
    private final PlacementRepository placementRepository;
    private final UserRepository userRepository;
    private final VerificationResultRepository verificationResultRepository;
    private final RewardRepository rewardRepository;
    private final RiderStatsRepository riderStatsRepository;
    private final AuditService auditService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        // Campaigns
        Map<String, Object> campaigns = new HashMap<>();
        campaigns.put("total", campaignRepository.count());
        campaigns.put("active", campaignRepository.countByStatus(CampaignStatus.ACTIVE));
        campaigns.put("completed", campaignRepository.countByStatus(CampaignStatus.COMPLETED));
        campaigns.put("draft", campaignRepository.countByStatus(CampaignStatus.DRAFT));
        dashboard.put("campaigns", campaigns);

        // Stickers
        Map<String, Object> stickers = new HashMap<>();
        stickers.put("total", stickerRepository.count());
        stickers.put("created", stickerRepository.countByStatus(StickerStatus.CREATED));
        stickers.put("withAgents", stickerRepository.countByStatus(StickerStatus.WITH_AGENT));
        stickers.put("withRiders", stickerRepository.countByStatus(StickerStatus.WITH_RIDER));
        stickers.put("used", stickerRepository.countByStatus(StickerStatus.USED));
        stickers.put("damaged", stickerRepository.countByStatus(StickerStatus.DAMAGED));
        dashboard.put("stickers", stickers);

        // Users
        Map<String, Object> users = new HashMap<>();
        users.put("advertisers", userRepository.findByRole(UserRole.ADVERTISER).size());
        users.put("agents", userRepository.findByRole(UserRole.AGENT).size());
        users.put("riders", userRepository.findByRole(UserRole.RIDER).size());
        dashboard.put("users", users);

        // Placements
        Map<String, Object> placements = new HashMap<>();
        placements.put("total", placementRepository.count());
        placements.put("verified", placementRepository.findByStatus(PlacementStatus.VERIFIED).size());
        placements.put("reviewRequired", placementRepository.findByStatus(PlacementStatus.REVIEW_REQUIRED).size());
        placements.put("rejected", placementRepository.findByStatus(PlacementStatus.REJECTED).size());
        placements.put("started", placementRepository.findByStatus(PlacementStatus.STARTED).size());
        dashboard.put("placements", placements);

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/campaigns")
    public ResponseEntity<?> getAllCampaigns() {
        return ResponseEntity.ok(campaignRepository.findAll());
    }

    @GetMapping("/stickers/overview")
    public ResponseEntity<?> getStickersOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("stickers", stickerRepository.findAll());
        overview.put("created", stickerRepository.countByStatus(StickerStatus.CREATED));
        overview.put("withAgents", stickerRepository.countByStatus(StickerStatus.WITH_AGENT));
        overview.put("withRiders", stickerRepository.countByStatus(StickerStatus.WITH_RIDER));
        overview.put("used", stickerRepository.countByStatus(StickerStatus.USED));
        overview.put("damaged", stickerRepository.countByStatus(StickerStatus.DAMAGED));
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/riders/overview")
    public ResponseEntity<?> getRidersOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("riders", userRepository.findByRole(UserRole.RIDER));
        overview.put("stats", riderStatsRepository.findAll());
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/audit-log")
    public ResponseEntity<?> getAuditLog() {
        return ResponseEntity.ok(auditService.getRecentLogs());
    }
}

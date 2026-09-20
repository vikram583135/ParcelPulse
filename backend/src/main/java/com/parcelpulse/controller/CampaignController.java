/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.controller;

import com.parcelpulse.domain.Campaign;
import com.parcelpulse.dto.CreateCampaignRequest;
import com.parcelpulse.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    public ResponseEntity<Campaign> create(@RequestBody CreateCampaignRequest request) {
        return ResponseEntity.ok(campaignService.createCampaign(request));
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAll() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @GetMapping("/advertiser/{advertiserId}")
    public ResponseEntity<List<Campaign>> getByAdvertiser(@PathVariable Long advertiserId) {
        return ResponseEntity.ok(campaignService.getCampaignsByAdvertiser(advertiserId));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Campaign> activate(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.activateCampaign(id));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignDashboard(id));
    }
}

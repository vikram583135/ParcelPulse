/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.controller;

import com.parcelpulse.domain.Sticker;
import com.parcelpulse.dto.AssignStickersRequest;
import com.parcelpulse.dto.GenerateStickersRequest;
import com.parcelpulse.dto.IssueStickersRequest;
import com.parcelpulse.service.StickerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stickers")
@RequiredArgsConstructor
public class StickerController {

    private final StickerService stickerService;

    @PostMapping("/generate")
    public ResponseEntity<List<Sticker>> generate(@RequestBody GenerateStickersRequest request) {
        return ResponseEntity.ok(stickerService.generateStickers(request));
    }

    @PostMapping("/issue-to-agent")
    public ResponseEntity<List<Sticker>> issueToAgent(@RequestBody IssueStickersRequest request) {
        return ResponseEntity.ok(stickerService.issueToAgent(request));
    }

    @PostMapping("/assign-to-rider")
    public ResponseEntity<List<Sticker>> assignToRider(@RequestBody AssignStickersRequest request) {
        return ResponseEntity.ok(stickerService.assignToRider(request));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Sticker>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(stickerService.getStickersByCampaign(campaignId));
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Sticker>> getByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(stickerService.getStickersByAgent(agentId));
    }

    @GetMapping("/agent/{agentId}/available")
    public ResponseEntity<List<Sticker>> getAgentAvailable(@PathVariable Long agentId) {
        return ResponseEntity.ok(stickerService.getAgentAvailableStickers(agentId));
    }

    @GetMapping("/rider/{riderId}")
    public ResponseEntity<List<Sticker>> getByRider(@PathVariable Long riderId) {
        return ResponseEntity.ok(stickerService.getStickersByRider(riderId));
    }

    @GetMapping("/rider/{riderId}/available")
    public ResponseEntity<List<Sticker>> getRiderAvailable(@PathVariable Long riderId) {
        return ResponseEntity.ok(stickerService.getRiderAvailableStickers(riderId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sticker> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stickerService.getStickerById(id));
    }

    @PutMapping("/{id}/damaged")
    public ResponseEntity<Sticker> markDamaged(@PathVariable Long id) {
        return ResponseEntity.ok(stickerService.markDamaged(id));
    }
}

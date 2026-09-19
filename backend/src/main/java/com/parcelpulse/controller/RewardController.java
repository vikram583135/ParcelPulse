package com.parcelpulse.controller;

import com.parcelpulse.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping("/rider/{riderId}")
    public ResponseEntity<?> getRiderRewards(@PathVariable Long riderId) {
        return ResponseEntity.ok(rewardService.getRiderRewards(riderId));
    }

    @GetMapping("/rider/{riderId}/summary")
    public ResponseEntity<Map<String, Object>> getRiderSummary(@PathVariable Long riderId) {
        return ResponseEntity.ok(rewardService.getRiderRewardSummary(riderId));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<Map<String, Object>> getCampaignSummary(@PathVariable Long campaignId) {
        return ResponseEntity.ok(rewardService.getCampaignRewardSummary(campaignId));
    }
}

/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.service;

import com.parcelpulse.domain.Campaign;
import com.parcelpulse.domain.Placement;
import com.parcelpulse.domain.Reward;
import com.parcelpulse.domain.RiderStats;
import com.parcelpulse.domain.enums.RewardStatus;
import com.parcelpulse.domain.enums.RewardType;
import com.parcelpulse.repository.CampaignRepository;
import com.parcelpulse.repository.RewardRepository;
import com.parcelpulse.repository.RiderStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RiderStatsRepository riderStatsRepository;
    private final CampaignRepository campaignRepository;
    private final AuditService auditService;

    @Value("${parcelpulse.reward.per-placement:10.00}")
    private BigDecimal defaultRewardPerPlacement;

    @Value("${parcelpulse.reward.completion-bonus:50.00}")
    private BigDecimal defaultCompletionBonus;

    @Value("${parcelpulse.reward.min-usage-percent:50}")
    private int minUsagePercent;

    @Transactional
    public void creditPlacementReward(Placement placement) {
        Campaign campaign = campaignRepository.findById(placement.getCampaignId()).orElse(null);
        BigDecimal rewardAmount = campaign != null && campaign.getRewardPerPlacement() != null
                ? campaign.getRewardPerPlacement() : defaultRewardPerPlacement;

        Reward reward = Reward.builder()
                .riderId(placement.getRiderId())
                .placementId(placement.getId())
                .campaignId(placement.getCampaignId())
                .type(RewardType.PLACEMENT)
                .amount(rewardAmount)
                .status(RewardStatus.CREDITED)
                .build();
        rewardRepository.save(reward);

        // Update rider stats
        RiderStats stats = riderStatsRepository
                .findByRiderIdAndCampaignId(placement.getRiderId(), placement.getCampaignId())
                .orElse(RiderStats.builder()
                        .riderId(placement.getRiderId())
                        .campaignId(placement.getCampaignId())
                        .stickersAssigned(0)
                        .placementsSubmitted(0)
                        .placementsVerified(0)
                        .placementsRejected(0)
                        .totalEarned(BigDecimal.ZERO)
                        .bonusEligible(false)
                        .bonusPaid(false)
                        .build());

        stats.setPlacementsSubmitted(stats.getPlacementsSubmitted() + 1);
        stats.setPlacementsVerified(stats.getPlacementsVerified() + 1);
        stats.setTotalEarned(stats.getTotalEarned().add(rewardAmount));

        // Check 100% completion bonus
        if (stats.getStickersAssigned() > 0
                && stats.getPlacementsVerified() >= stats.getStickersAssigned()
                && !stats.getBonusPaid()) {
            BigDecimal bonusAmount = campaign != null && campaign.getCompletionBonus() != null
                    ? campaign.getCompletionBonus() : defaultCompletionBonus;

            Reward bonus = Reward.builder()
                    .riderId(placement.getRiderId())
                    .campaignId(placement.getCampaignId())
                    .type(RewardType.COMPLETION_BONUS)
                    .amount(bonusAmount)
                    .status(RewardStatus.CREDITED)
                    .build();
            rewardRepository.save(bonus);

            stats.setBonusEligible(true);
            stats.setBonusPaid(true);
            stats.setTotalEarned(stats.getTotalEarned().add(bonusAmount));

            auditService.log("REWARD", placement.getRiderId(), "COMPLETION_BONUS",
                    "System", "100% completion bonus of ₹" + bonusAmount + " credited");
        }

        riderStatsRepository.save(stats);
        auditService.log("REWARD", reward.getId(), "PLACEMENT_REWARD",
                "System", "₹" + rewardAmount + " credited to Rider#" + placement.getRiderId());
    }

    public List<Reward> getRiderRewards(Long riderId) {
        return rewardRepository.findByRiderId(riderId);
    }

    public Map<String, Object> getRiderRewardSummary(Long riderId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEarned", rewardRepository.sumAmountByRiderId(riderId));
        summary.put("credited", rewardRepository.sumAmountByRiderIdAndStatus(riderId, RewardStatus.CREDITED));
        summary.put("pending", rewardRepository.sumAmountByRiderIdAndStatus(riderId, RewardStatus.PENDING));
        summary.put("rewards", rewardRepository.findByRiderId(riderId));
        summary.put("stats", riderStatsRepository.findByRiderId(riderId));
        return summary;
    }

    public Map<String, Object> getCampaignRewardSummary(Long campaignId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalPayout", rewardRepository.sumAmountByCampaignId(campaignId));
        summary.put("rewards", rewardRepository.findByCampaignId(campaignId));
        summary.put("riderStats", riderStatsRepository.findByCampaignId(campaignId));
        return summary;
    }
}

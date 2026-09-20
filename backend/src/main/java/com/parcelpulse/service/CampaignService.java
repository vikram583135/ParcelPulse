/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.service;

import com.parcelpulse.domain.Campaign;
import com.parcelpulse.domain.enums.CampaignStatus;
import com.parcelpulse.domain.enums.PaymentType;
import com.parcelpulse.domain.enums.PlacementStatus;
import com.parcelpulse.domain.enums.StickerStatus;
import com.parcelpulse.dto.CreateCampaignRequest;
import com.parcelpulse.repository.CampaignRepository;
import com.parcelpulse.repository.PlacementRepository;
import com.parcelpulse.repository.StickerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final StickerRepository stickerRepository;
    private final PlacementRepository placementRepository;
    private final AuditService auditService;

    @Value("${parcelpulse.discount.full-payment-percent:10}")
    private int fullPaymentDiscountPercent;

    @Value("${parcelpulse.reward.per-placement:10.00}")
    private BigDecimal rewardPerPlacement;

    @Value("${parcelpulse.reward.completion-bonus:50.00}")
    private BigDecimal completionBonus;

    // Platform rate charged to advertisers per placement
    private static final BigDecimal RATE_PER_PLACEMENT = new BigDecimal("50.00");

    public Campaign createCampaign(CreateCampaignRequest request) {
        PaymentType paymentType = PaymentType.valueOf(request.getPaymentType().toUpperCase());

        // Auto-calculate budget or placements based on mode
        String mode = request.getCampaignMode(); // "PLACEMENTS" or "BUDGET"
        Integer targetPlacements = request.getTargetPlacements();
        BigDecimal budget = request.getBudget();

        if ("PLACEMENTS".equalsIgnoreCase(mode)) {
            // Advertiser chose number of placements → we calculate budget
            budget = RATE_PER_PLACEMENT.multiply(BigDecimal.valueOf(targetPlacements));
        } else {
            // Advertiser chose budget → we calculate number of placements
            targetPlacements = budget.divide(RATE_PER_PLACEMENT, 0, RoundingMode.DOWN).intValue();
            if (targetPlacements < 1) targetPlacements = 1;
        }

        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal amountPaid = budget;

        if (paymentType == PaymentType.FULL) {
            discount = budget
                    .multiply(BigDecimal.valueOf(fullPaymentDiscountPercent))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            amountPaid = budget.subtract(discount);
        }

        Campaign campaign = Campaign.builder()
                .advertiserId(request.getAdvertiserId())
                .name(request.getName())
                .brandName(request.getBrandName())
                .adDescription(request.getAdDescription())
                .targetArea(request.getTargetArea())
                .targetPlacements(targetPlacements)
                .budget(budget)
                .paymentType(paymentType)
                .amountPaid(amountPaid)
                .discountApplied(discount)
                .status(CampaignStatus.DRAFT)
                .rewardPerPlacement(rewardPerPlacement)
                .completionBonus(completionBonus)
                .startDate(request.getStartDate() != null ? LocalDate.parse(request.getStartDate()) : LocalDate.now())
                .endDate(request.getEndDate() != null ? LocalDate.parse(request.getEndDate()) : LocalDate.now().plusMonths(1))
                .build();

        campaign = campaignRepository.save(campaign);
        auditService.log("CAMPAIGN", campaign.getId(), "CREATED", "Advertiser#" + request.getAdvertiserId(),
                "Campaign '" + campaign.getName() + "' created — " + targetPlacements + " placements, budget ₹" + budget);
        return campaign;
    }

    public Campaign activateCampaign(Long campaignId) {
        Campaign campaign = getCampaignById(campaignId);
        campaign.setStatus(CampaignStatus.ACTIVE);
        campaign = campaignRepository.save(campaign);
        auditService.log("CAMPAIGN", campaign.getId(), "ACTIVATED", "System",
                "Campaign '" + campaign.getName() + "' is now active");
        return campaign;
    }

    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public List<Campaign> getCampaignsByAdvertiser(Long advertiserId) {
        return campaignRepository.findByAdvertiserId(advertiserId);
    }

    public Map<String, Object> getCampaignDashboard(Long campaignId) {
        Campaign campaign = getCampaignById(campaignId);
        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("campaign", campaign);
        dashboard.put("totalStickers", stickerRepository.countByCampaignId(campaignId));
        dashboard.put("stickersDistributed", stickerRepository.countByCampaignIdAndStatus(campaignId, StickerStatus.WITH_AGENT)
                + stickerRepository.countByCampaignIdAndStatus(campaignId, StickerStatus.WITH_RIDER)
                + stickerRepository.countByCampaignIdAndStatus(campaignId, StickerStatus.USED));
        dashboard.put("placementsSubmitted", placementRepository.countByCampaignId(campaignId));
        dashboard.put("verifiedPlacements", placementRepository.countByCampaignIdAndStatus(campaignId, PlacementStatus.VERIFIED));
        dashboard.put("underReview", placementRepository.countByCampaignIdAndStatus(campaignId, PlacementStatus.REVIEW_REQUIRED));
        dashboard.put("rejected", placementRepository.countByCampaignIdAndStatus(campaignId, PlacementStatus.REJECTED));

        long verified = placementRepository.countByCampaignIdAndStatus(campaignId, PlacementStatus.VERIFIED);
        int target = campaign.getTargetPlacements() != null ? campaign.getTargetPlacements() : 1;
        double progress = target > 0 ? (double) verified / target * 100 : 0;
        dashboard.put("progressPercent", Math.min(progress, 100.0));

        return dashboard;
    }
}

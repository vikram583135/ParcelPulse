package com.parcelpulse.service;

import com.parcelpulse.domain.Campaign;
import com.parcelpulse.domain.Sticker;
import com.parcelpulse.domain.StickerHandover;
import com.parcelpulse.domain.RiderStats;
import com.parcelpulse.domain.enums.HandoverType;
import com.parcelpulse.domain.enums.StickerStatus;
import com.parcelpulse.dto.AssignStickersRequest;
import com.parcelpulse.dto.GenerateStickersRequest;
import com.parcelpulse.dto.IssueStickersRequest;
import com.parcelpulse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StickerService {

    private final StickerRepository stickerRepository;
    private final StickerHandoverRepository handoverRepository;
    private final CampaignRepository campaignRepository;
    private final RiderStatsRepository riderStatsRepository;
    private final AuditService auditService;

    @Transactional
    public List<Sticker> generateStickers(GenerateStickersRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        String brandCode = campaign.getBrandName().toUpperCase().replaceAll("[^A-Z0-9]", "");
        if (brandCode.length() > 8) brandCode = brandCode.substring(0, 8);

        long existingCount = stickerRepository.countByCampaignId(request.getCampaignId());
        List<Sticker> stickers = new ArrayList<>();

        for (int i = 0; i < request.getQuantity(); i++) {
            long seq = existingCount + i + 1;
            String code = String.format("PP-%s-%04d", brandCode, seq);
            String qrData = String.format("{\"campaign\":%d,\"sticker\":\"%s\",\"brand\":\"%s\"}",
                    campaign.getId(), code, campaign.getBrandName());

            Sticker sticker = Sticker.builder()
                    .campaignId(campaign.getId())
                    .stickerCode(code)
                    .qrData(qrData)
                    .status(StickerStatus.CREATED)
                    .build();
            stickers.add(sticker);
        }

        stickers = stickerRepository.saveAll(stickers);
        auditService.log("STICKER", campaign.getId(), "GENERATED",
                "System", request.getQuantity() + " stickers generated for campaign " + campaign.getName());
        return stickers;
    }

    @Transactional
    public List<Sticker> issueToAgent(IssueStickersRequest request) {
        List<Sticker> available = stickerRepository.findByCampaignIdAndStatus(
                request.getCampaignId(), StickerStatus.CREATED);

        if (available.size() < request.getQuantity()) {
            throw new RuntimeException("Not enough stickers available. Available: " + available.size());
        }

        List<Sticker> toIssue = available.subList(0, request.getQuantity());
        List<Sticker> issued = new ArrayList<>();

        for (Sticker sticker : toIssue) {
            sticker.setStatus(StickerStatus.WITH_AGENT);
            sticker.setCurrentAgentId(request.getAgentId());
            issued.add(stickerRepository.save(sticker));

            handoverRepository.save(StickerHandover.builder()
                    .stickerId(sticker.getId())
                    .fromUserId(null) // from ParcelPulse
                    .toUserId(request.getAgentId())
                    .handoverType(HandoverType.PP_TO_AGENT)
                    .build());
        }

        auditService.log("STICKER", request.getCampaignId(), "ISSUED_TO_AGENT",
                "Agent#" + request.getAgentId(),
                request.getQuantity() + " stickers issued to agent");
        return issued;
    }

    @Transactional
    public List<Sticker> assignToRider(AssignStickersRequest request) {
        List<Sticker> assigned = new ArrayList<>();

        for (Long stickerId : request.getStickerIds()) {
            Sticker sticker = stickerRepository.findById(stickerId)
                    .orElseThrow(() -> new RuntimeException("Sticker not found: " + stickerId));

            if (sticker.getStatus() != StickerStatus.WITH_AGENT) {
                throw new RuntimeException("Sticker " + sticker.getStickerCode() + " is not with agent");
            }
            if (!sticker.getCurrentAgentId().equals(request.getAgentId())) {
                throw new RuntimeException("Sticker " + sticker.getStickerCode() + " is not with this agent");
            }

            sticker.setStatus(StickerStatus.WITH_RIDER);
            sticker.setCurrentRiderId(request.getRiderId());
            assigned.add(stickerRepository.save(sticker));

            handoverRepository.save(StickerHandover.builder()
                    .stickerId(sticker.getId())
                    .fromUserId(request.getAgentId())
                    .toUserId(request.getRiderId())
                    .handoverType(HandoverType.AGENT_TO_RIDER)
                    .build());

            // Update rider stats
            RiderStats stats = riderStatsRepository
                    .findByRiderIdAndCampaignId(request.getRiderId(), sticker.getCampaignId())
                    .orElse(RiderStats.builder()
                            .riderId(request.getRiderId())
                            .campaignId(sticker.getCampaignId())
                            .stickersAssigned(0)
                            .placementsSubmitted(0)
                            .placementsVerified(0)
                            .placementsRejected(0)
                            .totalEarned(BigDecimal.ZERO)
                            .bonusEligible(false)
                            .bonusPaid(false)
                            .build());
            stats.setStickersAssigned(stats.getStickersAssigned() + 1);
            riderStatsRepository.save(stats);
        }

        auditService.log("STICKER", request.getAgentId(), "ASSIGNED_TO_RIDER",
                "Agent#" + request.getAgentId(),
                request.getStickerIds().size() + " stickers assigned to Rider#" + request.getRiderId());
        return assigned;
    }

    public Sticker markDamaged(Long stickerId) {
        Sticker sticker = stickerRepository.findById(stickerId)
                .orElseThrow(() -> new RuntimeException("Sticker not found"));
        sticker.setStatus(StickerStatus.DAMAGED);
        sticker = stickerRepository.save(sticker);
        auditService.log("STICKER", stickerId, "DAMAGED", "System",
                "Sticker " + sticker.getStickerCode() + " marked as damaged");
        return sticker;
    }

    public List<Sticker> getStickersByCampaign(Long campaignId) {
        return stickerRepository.findByCampaignId(campaignId);
    }

    public List<Sticker> getStickersByAgent(Long agentId) {
        return stickerRepository.findByCurrentAgentId(agentId);
    }

    public List<Sticker> getAgentAvailableStickers(Long agentId) {
        return stickerRepository.findByCurrentAgentIdAndStatus(agentId, StickerStatus.WITH_AGENT);
    }

    public List<Sticker> getStickersByRider(Long riderId) {
        return stickerRepository.findByCurrentRiderId(riderId);
    }

    public List<Sticker> getRiderAvailableStickers(Long riderId) {
        return stickerRepository.findByCurrentRiderIdAndStatus(riderId, StickerStatus.WITH_RIDER);
    }

    public Sticker getStickerById(Long id) {
        return stickerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sticker not found"));
    }
}

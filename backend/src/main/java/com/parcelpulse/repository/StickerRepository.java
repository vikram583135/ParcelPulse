package com.parcelpulse.repository;

import com.parcelpulse.domain.Sticker;
import com.parcelpulse.domain.enums.StickerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StickerRepository extends JpaRepository<Sticker, Long> {
    List<Sticker> findByCampaignId(Long campaignId);
    List<Sticker> findByCurrentAgentId(Long agentId);
    List<Sticker> findByCurrentRiderId(Long riderId);
    List<Sticker> findByCampaignIdAndStatus(Long campaignId, StickerStatus status);
    List<Sticker> findByCurrentAgentIdAndStatus(Long agentId, StickerStatus status);
    List<Sticker> findByCurrentRiderIdAndStatus(Long riderId, StickerStatus status);
    Optional<Sticker> findByStickerCode(String stickerCode);
    long countByCampaignId(Long campaignId);
    long countByCampaignIdAndStatus(Long campaignId, StickerStatus status);
    long countByStatus(StickerStatus status);
}

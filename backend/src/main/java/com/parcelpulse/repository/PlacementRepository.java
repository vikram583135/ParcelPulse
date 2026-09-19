package com.parcelpulse.repository;

import com.parcelpulse.domain.Placement;
import com.parcelpulse.domain.enums.PlacementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlacementRepository extends JpaRepository<Placement, Long> {
    List<Placement> findByRiderId(Long riderId);
    List<Placement> findByCampaignId(Long campaignId);
    List<Placement> findByStatus(PlacementStatus status);
    List<Placement> findByStickerId(Long stickerId);
    long countByCampaignId(Long campaignId);
    long countByCampaignIdAndStatus(Long campaignId, PlacementStatus status);
    long countByRiderIdAndCampaignId(Long riderId, Long campaignId);
    long countByRiderIdAndCampaignIdAndStatus(Long riderId, Long campaignId, PlacementStatus status);
    List<Placement> findByPhotoHashStartOrPhotoHashEnd(String hashStart, String hashEnd);
}

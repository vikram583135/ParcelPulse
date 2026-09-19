package com.parcelpulse.service;

import com.parcelpulse.domain.Placement;
import com.parcelpulse.domain.Sticker;
import com.parcelpulse.domain.enums.PlacementStatus;
import com.parcelpulse.domain.enums.StickerStatus;
import com.parcelpulse.repository.PlacementRepository;
import com.parcelpulse.repository.StickerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlacementService {

    private final PlacementRepository placementRepository;
    private final StickerRepository stickerRepository;
    private final VerificationService verificationService;
    private final AuditService auditService;

    @Value("${parcelpulse.upload-dir:./uploads}")
    private String uploadDir;

    @Transactional
    public Placement startPlacement(Long stickerId, Long riderId, MultipartFile photo,
                                     BigDecimal latitude, BigDecimal longitude) throws IOException {
        Sticker sticker = stickerRepository.findById(stickerId)
                .orElseThrow(() -> new RuntimeException("Sticker not found"));

        if (sticker.getStatus() != StickerStatus.WITH_RIDER) {
            throw new RuntimeException("Sticker is not assigned to a rider");
        }
        if (!sticker.getCurrentRiderId().equals(riderId)) {
            throw new RuntimeException("Sticker is not assigned to this rider");
        }

        // Save photo
        String photoPath = savePhoto(photo, "start");
        String photoHash = computeHash(photo.getBytes());

        Placement placement = Placement.builder()
                .stickerId(stickerId)
                .riderId(riderId)
                .campaignId(sticker.getCampaignId())
                .status(PlacementStatus.STARTED)
                .startPhotoPath(photoPath)
                .startLatitude(latitude)
                .startLongitude(longitude)
                .startTime(LocalDateTime.now())
                .photoHashStart(photoHash)
                .build();

        placement = placementRepository.save(placement);

        // Mark sticker as used
        sticker.setStatus(StickerStatus.USED);
        stickerRepository.save(sticker);

        auditService.log("PLACEMENT", placement.getId(), "STARTED",
                "Rider#" + riderId, "Placement started for sticker " + sticker.getStickerCode());
        return placement;
    }

    @Transactional
    public Placement endPlacement(Long placementId, MultipartFile photo,
                                   BigDecimal latitude, BigDecimal longitude) throws IOException {
        Placement placement = placementRepository.findById(placementId)
                .orElseThrow(() -> new RuntimeException("Placement not found"));

        if (placement.getStatus() != PlacementStatus.STARTED) {
            throw new RuntimeException("Placement is not in STARTED status");
        }

        // Save photo
        String photoPath = savePhoto(photo, "end");
        String photoHash = computeHash(photo.getBytes());

        placement.setEndPhotoPath(photoPath);
        placement.setEndLatitude(latitude);
        placement.setEndLongitude(longitude);
        placement.setEndTime(LocalDateTime.now());
        placement.setPhotoHashEnd(photoHash);
        placement.setStatus(PlacementStatus.SUBMITTED);

        placement = placementRepository.save(placement);

        auditService.log("PLACEMENT", placement.getId(), "SUBMITTED",
                "Rider#" + placement.getRiderId(), "End evidence submitted");

        // Auto-trigger verification
        verificationService.verifyPlacement(placement);

        return placementRepository.findById(placementId).orElse(placement);
    }

    public Placement getPlacementById(Long id) {
        return placementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found"));
    }

    public List<Placement> getPlacementsByRider(Long riderId) {
        return placementRepository.findByRiderId(riderId);
    }

    public List<Placement> getPlacementsByCampaign(Long campaignId) {
        return placementRepository.findByCampaignId(campaignId);
    }

    public Map<String, Object> getPlacementEvidence(Long placementId) {
        Placement placement = getPlacementById(placementId);
        Sticker sticker = stickerRepository.findById(placement.getStickerId()).orElse(null);

        Map<String, Object> evidence = new HashMap<>();
        evidence.put("placement", placement);
        evidence.put("sticker", sticker);
        evidence.put("startPhotoUrl", "/uploads/" + placement.getStartPhotoPath());
        evidence.put("endPhotoUrl", placement.getEndPhotoPath() != null ? "/uploads/" + placement.getEndPhotoPath() : null);
        return evidence;
    }

    private String savePhoto(MultipartFile file, String prefix) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = prefix + "_" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes());
        return filename;
    }

    private String computeHash(byte[] data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(data);
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString();
        }
    }
}

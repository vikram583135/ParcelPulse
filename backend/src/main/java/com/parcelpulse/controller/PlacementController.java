package com.parcelpulse.controller;

import com.parcelpulse.domain.Placement;
import com.parcelpulse.service.PlacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService placementService;

    @PostMapping("/start")
    public ResponseEntity<Placement> startPlacement(
            @RequestParam Long stickerId,
            @RequestParam Long riderId,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude) throws Exception {
        return ResponseEntity.ok(placementService.startPlacement(stickerId, riderId, photo, latitude, longitude));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<Placement> endPlacement(
            @PathVariable Long id,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude) throws Exception {
        return ResponseEntity.ok(placementService.endPlacement(id, photo, latitude, longitude));
    }

    @GetMapping("/rider/{riderId}")
    public ResponseEntity<List<Placement>> getByRider(@PathVariable Long riderId) {
        return ResponseEntity.ok(placementService.getPlacementsByRider(riderId));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Placement>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(placementService.getPlacementsByCampaign(campaignId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Placement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(placementService.getPlacementById(id));
    }

    @GetMapping("/{id}/evidence")
    public ResponseEntity<Map<String, Object>> getEvidence(@PathVariable Long id) {
        return ResponseEntity.ok(placementService.getPlacementEvidence(id));
    }
}

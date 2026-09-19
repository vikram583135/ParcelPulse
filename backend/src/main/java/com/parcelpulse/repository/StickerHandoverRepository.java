package com.parcelpulse.repository;

import com.parcelpulse.domain.StickerHandover;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StickerHandoverRepository extends JpaRepository<StickerHandover, Long> {
    List<StickerHandover> findByStickerId(Long stickerId);
    List<StickerHandover> findByToUserId(Long userId);
}

package com.parcelpulse.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignStickersRequest {
    private Long agentId;
    private Long riderId;
    private List<Long> stickerIds;
}

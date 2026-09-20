/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.service;

import com.parcelpulse.domain.AuditLog;
import com.parcelpulse.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(String entityType, Long entityId, String action, String performedBy, String details) {
        AuditLog log = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(performedBy)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getLogsForEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }
}

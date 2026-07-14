package com.tinasheGomo.MonishaInventoryManagementSystem.dto.admin.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ResetAuditLogResponseDTO {

    private UUID logId;
    private String performedBy;
    private String tablesCleared;
    private String rowCounts;
    private LocalDateTime resetAt;
}

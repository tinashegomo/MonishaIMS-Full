package com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class DepletedHistoryResponseDTO {

    private UUID depletedId;
    private UUID batchId;
    private LocalDateTime depletedAt;
}

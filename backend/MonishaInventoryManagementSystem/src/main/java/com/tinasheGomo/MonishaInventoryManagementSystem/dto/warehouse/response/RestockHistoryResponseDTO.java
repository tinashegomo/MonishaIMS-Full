package com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RestockHistoryResponseDTO {

    private UUID restockId;
    private UUID batchId;
    private String size;
    private Integer quantityAdded;
    private String restockedBy;
    private LocalDateTime restockedAt;
}

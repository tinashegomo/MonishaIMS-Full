package com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class WarehouseBatchSizeResponseDTO {

    private UUID sizeId;

    private String size;

    private Integer quantity;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

package com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ProductRestockHistoryResponseDTO {

    private UUID restockId;
    private UUID productId;
    private String size;
    private Integer quantityAdded;
    private String restockedBy;
    private LocalDateTime restockedAt;
}

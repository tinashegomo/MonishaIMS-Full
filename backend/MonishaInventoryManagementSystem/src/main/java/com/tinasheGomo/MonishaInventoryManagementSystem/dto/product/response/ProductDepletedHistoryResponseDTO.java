package com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ProductDepletedHistoryResponseDTO {

    private UUID depletedId;
    private UUID productId;
    private LocalDateTime depletedAt;
}

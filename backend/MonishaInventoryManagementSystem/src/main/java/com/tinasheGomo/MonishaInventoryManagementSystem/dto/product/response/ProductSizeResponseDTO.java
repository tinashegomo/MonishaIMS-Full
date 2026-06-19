package com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ProductSizeResponseDTO {

    private UUID productSizeId;

    private String size;

    private Integer quantity;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
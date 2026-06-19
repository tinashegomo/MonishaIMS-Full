package com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ProductResponseDTO {

    private UUID productId;

    private String productName;

    private Integer productPrice;

    private Integer totalPrice;

    private UUID schoolId;

    private String schoolName;

    private UUID batchId;

    private String batchName;

    private String type;

    private String variant;

    private String color;

    private Integer totalQuantity;

    private String description;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<ProductSizeResponseDTO> productSizes;
}
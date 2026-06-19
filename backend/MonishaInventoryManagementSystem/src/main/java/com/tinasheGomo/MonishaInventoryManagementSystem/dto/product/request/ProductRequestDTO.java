package com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ProductRequestDTO {

    @NotBlank(message = "Product name is required")
    private String productName;

    private String description;

    @NotNull(message = "Product price is required")
    private Integer productPrice;

    @NotEmpty(message = "Product must contain at least one size")
    private List<ProductSizeRequestDTO> productSizes;

    private UUID schoolId;

    @NotNull(message = "Batch ID is required")
    private UUID batchId;

}
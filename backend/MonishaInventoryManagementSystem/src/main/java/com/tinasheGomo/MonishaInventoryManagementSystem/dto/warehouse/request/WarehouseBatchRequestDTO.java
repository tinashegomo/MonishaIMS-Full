package com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WarehouseBatchRequestDTO {

    @NotBlank(message = "Batch name is required")
    private String batchName;

    @NotNull(message = "Batch price is required")
    private Integer batchPrice;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Variant is required")
    private String variant;

    @NotBlank(message = "Color is required")
    private String color;

    private String description;

    @NotEmpty(message = "Batch must contain at least one size")
    private List<WarehouseBatchSizeRequestDTO> batchSizes;
}

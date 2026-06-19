package com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement.MeasurementResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderItemResponseDTO {

    private UUID orderItemId;

    private String type;

    private String variant;

    private String color;

    private String size;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

    private Boolean customMade;

    private Boolean measurementsTaken;

    private UUID productId;

    private UUID batchId;

    private LocalDateTime createdAt;

    private List<MeasurementResponseDTO> measurements;
}
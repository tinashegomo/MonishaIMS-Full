package com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement.MeasurementRequestDTO;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderItemRequestDTO {

    /*
        READY-MADE ONLY
        Send productId OR batchId, not both.
        If neither is sent, the order is treated as custom-made.
     */
    private UUID productId;
    private UUID batchId;

    /*
        READY-MADE ONLY
        Size to deduct from inventory.
        Not required for custom-made — no stock exists yet.
     */
    private String size;

    /*
        REQUIRED FOR ALL ITEM TYPES
        Minimum 1 — you cannot order zero items.
     */
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    /*
        CUSTOM-MADE ONLY
        For ready-made, these are copied from inventory automatically.
        For custom-made, the frontend sends them because no inventory exists yet.
     */
    private String type;
    private String variant;
    private String color;

    /*
        CUSTOM-MADE ONLY
        For ready-made, price comes from the product or batch.
        For custom-made, the cashier sets the price manually.
     */
    private BigDecimal unitPrice;

    /*
        FLAGS
        customMade — true if this item will be produced later
        measurementsTaken — true if customer measurements were recorded
     */
    private Boolean customMade;
    private Boolean measurementsTaken;

    /*
        MEASUREMENTS
        Only populated when measurementsTaken is true.
     */
    private List<MeasurementRequestDTO> measurements;
}
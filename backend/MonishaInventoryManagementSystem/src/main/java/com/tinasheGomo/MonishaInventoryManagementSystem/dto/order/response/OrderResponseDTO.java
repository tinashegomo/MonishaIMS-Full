package com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response;

import com.tinasheGomo.MonishaInventoryManagementSystem.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderResponseDTO {

    private UUID orderId;

    /*
        ORDER NUMBER
        Human-readable identifier for the order.
        Example: ORD-1716123456789-3f2a
     */
    private String orderNumber;

    /*
        CUSTOMER SNAPSHOT
        Flattened from the customer relationship.
     */
    private UUID customerId;
    private String customerName;

    /*
        SCHOOL SNAPSHOT (OPTIONAL)
        Only present if this is a school uniform order.
     */
    private UUID schoolId;
    private String schoolName;

    /*
        FINANCIAL SUMMARY
        totalAmount — sum of all order item totals
        paidAmount  — what the customer has paid so far
        balance     — what remains to be paid
        fullyPaid   — true when balance is zero
     */
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balance;
    private Boolean fullyPaid;

    /*
        ORDER FLAGS
        hasMeasurements — true if any item in this order has measurements
        schoolOrder     — true if this order is linked to a school
     */
    private Boolean hasMeasurements;
    private Boolean schoolOrder;

    /*
        ORDER STATUS
        Tracks where this order is in its lifecycle.
        PENDING → IN_PRODUCTION → READY_FOR_COLLECTION → COMPLETED
     */
    private OrderStatus orderStatus;

    private LocalDate collectionDate;

    private String notes;

    private String createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /*
        ORDER ITEMS
        Full list of items in this order including measurements.
     */
    private List<OrderItemResponseDTO> orderItems;
}
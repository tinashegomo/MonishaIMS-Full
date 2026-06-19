package com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderRequestDTO {

    /*
        CUSTOMER
        Every order must belong to a customer.
     */
    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    /*
        SCHOOL (OPTIONAL)
        Only sent if this is a school uniform order.
        If schoolId is present → school order.
        If schoolId is null → general shop order.
        No need for a separate schoolOrder flag.
     */
    private UUID schoolId;

    /*
        PAYMENT
        The amount the customer is paying now.
        Can be partial — balance will be calculated in the service.
        Cannot exceed the total order amount.
     */
    @NotNull(message = "Paid amount is required")
    private BigDecimal paidAmount;

    /*
        COLLECTION DATE (OPTIONAL)
        When the customer expects to collect the order.
        Useful for tailoring and production planning.
     */
    private LocalDate collectionDate;

    /*
        NOTES (OPTIONAL)
        Any extra instructions from the customer.
     */
    private String notes;

    /*
        ORDER ITEMS
        At least one item is required per order.
        Each item handles its own type: ready-made or custom.
     */
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequestDTO> orderItems;
}
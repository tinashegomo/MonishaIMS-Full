package com.tinasheGomo.MonishaInventoryManagementSystem.entity.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.customer.CustomerEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.school.SchoolEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID orderId;

    /*
        ORDER NUMBER
        Human-readable identifier generated in the service.
        Unique across all orders.
     */
    @Column(nullable = false, unique = true)
    private String orderNumber;

    /*
        FINANCIAL FIELDS
        All set by the service — never by the mapper from DTO.
        totalAmount = sum of all item totals
        paidAmount  = what the customer paid upfront
        balance     = totalAmount - paidAmount
        fullyPaid   = true when balance == 0
     */
    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private BigDecimal paidAmount;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private Boolean fullyPaid;

    /*
        ORDER FLAGS
        hasMeasurements — derived in service: true if any item has measurements
        schoolOrder     — derived in service: true if schoolId was provided
     */
    @Column(nullable = false)
    private Boolean hasMeasurements;

    @Column(nullable = false)
    private Boolean schoolOrder;

    /*
        ORDER STATUS
        Set by the service based on business rules.
        Never set by the frontend directly.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    @Column
    private LocalDate collectionDate;

    @Column(length = 1000)
    private String notes;

    @Column
    private String createdBy;

    /*
        TIMESTAMPS
        createdAt is set once and never changed.
        updatedAt is refreshed on every save.
     */
    @Column(nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /*
        RELATIONSHIPS
        customer — required, every order belongs to a customer
        school   — optional, only for school uniform orders
        orderItems — the line items in this order
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "customerId", nullable = false)
    private CustomerEntity customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", referencedColumnName = "schoolId")
    private SchoolEntity school;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> orderItems;
}
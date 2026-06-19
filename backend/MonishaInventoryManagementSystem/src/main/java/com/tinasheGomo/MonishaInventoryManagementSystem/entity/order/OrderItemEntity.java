package com.tinasheGomo.MonishaInventoryManagementSystem.entity.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.measurement.MeasurementEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID orderItemId;

    /*
        SNAPSHOT FIELDS
        Copied from product or batch at time of order.
        Stored here so order history is never affected
        by future inventory changes.
     */
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String variant;

    @Column(nullable = false)
    private String color;

    /*
        SIZE
        The specific size ordered.
        Nullable — custom-made items have no size.
     */
    private String size;

    @Column(nullable = false)
    private Integer quantity;

    /*
        PRICE SNAPSHOT
        unitPrice is copied from inventory for ready-made.
        For custom-made, it is set manually by the cashier.
        totalPrice = unitPrice x quantity, calculated in service.
     */
    @Column(nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    /*
        FLAGS
        customMade — whether this item needs to be produced
        measurementsTaken — whether measurements were recorded
     */
    @Column(nullable = false)
    private Boolean customMade;

    @Column(nullable = false)
    private Boolean measurementsTaken;

    /*
        TIMESTAMPS
        createdAt is set once on insert and never updated.
        updatedAt is refreshed on every update.
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
        order — the parent order this item belongs to
        product — set for product inventory orders (nullable)
        batch — set for batch inventory orders (nullable)
        measurements — child measurements for custom-made items
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "orderId")
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "productId")
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", referencedColumnName = "batchId")
    private WarehouseBatchEntity batch;

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL)
    private List<MeasurementEntity> measurements;
}
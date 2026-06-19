package com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class WarehouseBatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID batchId;

    @Column(nullable = false, unique = true)
    private String batchName;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String variant;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private Integer batchPrice;

    @Column(nullable = false)
    private Integer totalQuantity;

    @Column(nullable = false)
    private Integer totalPrice;

    @Column(length = 1000)
    private String description;

    @Column
    private String createdBy;

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

    @OneToMany(mappedBy = "batch",  orphanRemoval = true, cascade = CascadeType.ALL)
    private List<WarehouseBatchSizeEntity> batchSizes;

    @OneToMany(mappedBy = "batch",  orphanRemoval = true, cascade = CascadeType.ALL)
    private List<ProductEntity> products;
}
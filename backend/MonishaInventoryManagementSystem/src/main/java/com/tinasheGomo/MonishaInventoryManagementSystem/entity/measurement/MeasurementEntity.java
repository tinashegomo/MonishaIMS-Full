package com.tinasheGomo.MonishaInventoryManagementSystem.entity.measurement;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderItemEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class MeasurementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID measurementId;

    @Column(nullable = false)
    private String measurementName;

    @Column(nullable = false)
    private BigDecimal measurementValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", referencedColumnName = "orderItemId")
    private OrderItemEntity orderItem;
}
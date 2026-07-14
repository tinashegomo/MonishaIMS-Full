package com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class RestockHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID restockId;

    @Column(nullable = false)
    private UUID batchId;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private Integer quantityAdded;

    @Column(nullable = false)
    private String restockedBy;

    @Column(nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime restockedAt;

    @PrePersist
    public void onCreate() {
        this.restockedAt = LocalDateTime.now();
    }
}

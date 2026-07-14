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
public class DepletedHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID depletedId;

    @Column(nullable = false)
    private UUID batchId;

    @Column(nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime depletedAt;

    @PrePersist
    public void onCreate() {
        this.depletedAt = LocalDateTime.now();
    }
}

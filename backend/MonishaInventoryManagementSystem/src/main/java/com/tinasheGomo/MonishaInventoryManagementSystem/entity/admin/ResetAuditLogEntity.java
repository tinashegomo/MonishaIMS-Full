package com.tinasheGomo.MonishaInventoryManagementSystem.entity.admin;

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
public class ResetAuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID logId;

    @Column(nullable = false)
    private String performedBy;

    @Column(nullable = false, length = 1000)
    private String tablesCleared;

    @Column(nullable = false, length = 2000)
    private String rowCounts;

    @Column(nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime resetAt;

    @PrePersist
    public void onCreate() {
        this.resetAt = LocalDateTime.now();
    }
}

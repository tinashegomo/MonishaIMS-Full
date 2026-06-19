package com.tinasheGomo.MonishaInventoryManagementSystem.entity.school;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductSizeEntity;
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
public class SchoolEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID schoolId;

    @Column(nullable = false, unique = true)
    private String schoolName;

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

    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL)
    private List<ProductEntity> products;
}

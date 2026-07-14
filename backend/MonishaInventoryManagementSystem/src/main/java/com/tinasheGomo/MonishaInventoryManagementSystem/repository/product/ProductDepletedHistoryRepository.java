package com.tinasheGomo.MonishaInventoryManagementSystem.repository.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductDepletedHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductDepletedHistoryRepository extends JpaRepository<ProductDepletedHistoryEntity, UUID> {

    List<ProductDepletedHistoryEntity> findByProductIdOrderByDepletedAtDesc(UUID productId);
}

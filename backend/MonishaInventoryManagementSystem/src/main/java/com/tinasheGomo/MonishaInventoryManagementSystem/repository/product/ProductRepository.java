package com.tinasheGomo.MonishaInventoryManagementSystem.repository.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {

    Optional<ProductEntity> findByProductId(UUID productId);
}

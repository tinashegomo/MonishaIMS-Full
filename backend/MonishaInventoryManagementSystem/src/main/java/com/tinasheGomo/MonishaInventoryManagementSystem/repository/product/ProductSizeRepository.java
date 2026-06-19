package com.tinasheGomo.MonishaInventoryManagementSystem.repository.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSizeEntity, UUID> {

    List<ProductSizeEntity> findByProduct_ProductId(UUID productId);

    Optional<ProductSizeEntity> findByProduct_ProductIdAndSize(UUID productId, String size);

//    List<ProductSizeEntity> findByProduct_ProductIdAndSize(UUID productId, String size);
}

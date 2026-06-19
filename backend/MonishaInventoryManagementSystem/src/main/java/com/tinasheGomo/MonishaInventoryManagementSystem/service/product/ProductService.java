package com.tinasheGomo.MonishaInventoryManagementSystem.service.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.school.SchoolEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.product.ProductMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.school.SchoolRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse.WarehouseBatchSizeService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    private final SchoolRepository schoolRepository;
    private final WarehouseBatchRepository batchRepository;

    private final ProductSizeService productSizeService;

    private final WarehouseBatchSizeService batchSizeService;

    private final EntityManager entityManager;

    /**
     * CREATE PRODUCT
     */
    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {

        // 1. Map basic product fields
        ProductEntity product = productMapper.toEntity(requestDTO);

        product.setProductSizes(new ArrayList<>());
        product.setTotalQuantity(0);
        product.setTotalPrice(0);

        // 2. Attach school (optional)
        if (requestDTO.getSchoolId() != null) {
            SchoolEntity school = schoolRepository.findBySchoolId(requestDTO.getSchoolId())
                    .orElseThrow(() -> new NotFoundException("School not found"));

            product.setSchool(school);
        }

        // 3. Attach batch (mandatory)
        WarehouseBatchEntity batch = batchRepository.findByBatchId(requestDTO.getBatchId())
                .orElseThrow(() -> new NotFoundException("Batch not found"));

        product.setBatch(batch);

        // 4. Override product attributes from batch (business rule)
        product.setType(batch.getType());
        product.setVariant(batch.getVariant());
        product.setColor(batch.getColor());

        // 5. Set createdBy from current authenticated user
        product.setCreatedBy(SecurityUtils.getCurrentUser().getUser().getUserName());

        // 5. Save product first
        ProductEntity savedProduct = productRepository.save(product);

        // 6. Add all sizes to product at once
        productSizeService.addSizesToProduct(savedProduct.getProductId(), requestDTO.getProductSizes());

        // 7. Deduct stock from batch for each size
        for (ProductSizeRequestDTO sizeDTO : requestDTO.getProductSizes()) {
            batchSizeService.deductStock(batch.getBatchId(), sizeDTO.getSize(), sizeDTO.getQuantity());
        }

        // 8. Flush + Clear — force size inserts to DB, discard stale cached entity
        entityManager.flush();
        entityManager.clear();

        // 9. Reload product with sizes (fresh from DB)
        ProductEntity updatedProduct = productRepository.findByProductId(savedProduct.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found after save"));

        // 10. Calculate total quantity
        int totalQuantity = productSizeService.calculateProductTotalQuantity(updatedProduct);
        updatedProduct.setTotalQuantity(totalQuantity);

        // 11. Calculate total price
        updatedProduct.setTotalPrice(totalQuantity * updatedProduct.getProductPrice());

        // 12. Save final product
        ProductEntity finalProduct = productRepository.save(updatedProduct);

        return productMapper.toResponse(finalProduct);
    }

    public ProductResponseDTO getProductById(UUID productId) {

        ProductEntity product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        return productMapper.toResponse(product);
    }

    public List<ProductResponseDTO> getAllProducts() {

        return productMapper.toResponseList(productRepository.findAll());
    }

    public void deleteProduct(UUID productId) {

        ProductEntity product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        productRepository.delete(product);
    }
}

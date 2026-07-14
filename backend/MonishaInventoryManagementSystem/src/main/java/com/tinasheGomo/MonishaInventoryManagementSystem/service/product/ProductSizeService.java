package com.tinasheGomo.MonishaInventoryManagementSystem.service.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductSizeResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.shared.SizeQuantityDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductSizeEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductDepletedHistoryEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductRestockHistoryEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchSizeEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.product.ProductSizeMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductDepletedHistoryRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductSizeRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductRestockHistoryRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchSizeRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse.WarehouseBatchSizeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductSizeService {

    private final ProductSizeRepository sizeRepository;
    private final ProductRepository productRepository;
    private final ProductSizeMapper sizeMapper;
    private final WarehouseBatchSizeRepository batchSizeRepository;
    private final WarehouseBatchSizeService batchSizeService;
    private final ProductRestockHistoryRepository productRestockHistoryRepository;
    private final ProductDepletedHistoryRepository productDepletedHistoryRepository;

    /**
     * Add sizes to a product
     */
    public List<ProductSizeEntity> addSizesToProduct(UUID productId, List<ProductSizeRequestDTO> dtos) {

        ProductEntity product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        List<ProductSizeEntity> sizes = new ArrayList<>();

        for (ProductSizeRequestDTO dto : dtos) {
            ProductSizeEntity size = sizeMapper.toEntity(dto);
            size.setProduct(product);
            sizes.add(size);
        }

        return sizeRepository.saveAll(sizes);
    }

    /**
     * Get sizes for product
     */
    public List<ProductSizeResponseDTO> getSizesByProduct(UUID productId) {

        ProductEntity product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        return sizeMapper.toResponseList(product.getProductSizes());
    }

    /**
     * Calculate total product quantity
     */
    public int calculateProductTotalQuantity(ProductEntity product) {

        int total = 0;
        for (ProductSizeEntity size : product.getProductSizes()) {
            total = total + size.getQuantity();
        }
        return total;
    }

    /**
     * Deduct stock from a product size

     * This is used for:
     * School orders WITHOUT measurements
     */
    public void deductStock(UUID productId, String size, int quantityToDeduct) {

        // Find specific size inside product
        ProductSizeEntity productSize = sizeRepository.findByProduct_ProductIdAndSize(productId, size)
                .orElseThrow(
                        () -> new NotFoundException("Size not found in product"
                        )
                );

    /*
        VALIDATION

        Prevent negative stock.

        Example:
        Available = 5
        Requested = 10

        This must fail.
     */
        if (productSize.getQuantity() < quantityToDeduct) {

            throw new RuntimeException("Insufficient stock for size: " + size);
        }

    /*
        DEDUCT STOCK

        Example:

        Before:
        20

        Ordered:
        3

        After:
        17
     */
        productSize.setQuantity(productSize.getQuantity() - quantityToDeduct);

        sizeRepository.save(productSize);

    /*
        VERY IMPORTANT

        Product total quantity must also update.

        Because total quantity is the SUM
        of all sizes.
     */
        ProductEntity product = productSize.getProduct();

        int totalQuantity = calculateProductTotalQuantity(product);

        product.setTotalQuantity(totalQuantity);

        // Auto-detect depletion
        if (totalQuantity == 0 && product.getDepletedAt() == null) {
            product.setDepletedAt(LocalDateTime.now());
        }

        productRepository.save(product);

        // Record depletion history
        if (totalQuantity == 0) {
            ProductDepletedHistoryEntity depletedHistory = new ProductDepletedHistoryEntity();
            depletedHistory.setProductId(productId);
            productDepletedHistoryRepository.save(depletedHistory);
        }
    }

    /**
     * Restock product sizes, deduct from batch sizes, and record restock history
     */
    @Transactional
    public void restockProductSizes(ProductEntity product, WarehouseBatchEntity batch, List<SizeQuantityDTO> restockItems, String restockedBy) {
        for (SizeQuantityDTO item : restockItems) {
            // Deduct from batch via centralized deductStock (handles depletion detection)
            batchSizeService.deductStock(batch.getBatchId(), item.getSize(), item.getQuantity());

            // Add to product (find existing or create new)
            ProductSizeEntity existingSize = sizeRepository
                    .findByProduct_ProductIdAndSize(product.getProductId(), item.getSize())
                    .orElse(null);

            if (existingSize != null) {
                existingSize.setQuantity(existingSize.getQuantity() + item.getQuantity());
                sizeRepository.save(existingSize);
            } else {
                ProductSizeEntity newSize = new ProductSizeEntity();
                newSize.setProduct(product);
                newSize.setSize(item.getSize());
                newSize.setQuantity(item.getQuantity());
                sizeRepository.save(newSize);
            }

            // Record restock history
            ProductRestockHistoryEntity history = new ProductRestockHistoryEntity();
            history.setProductId(product.getProductId());
            history.setSize(item.getSize());
            history.setQuantityAdded(item.getQuantity());
            history.setRestockedBy(restockedBy);
            productRestockHistoryRepository.save(history);
        }
    }
}
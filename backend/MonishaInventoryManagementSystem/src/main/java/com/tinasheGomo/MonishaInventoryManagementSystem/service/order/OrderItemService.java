package com.tinasheGomo.MonishaInventoryManagementSystem.service.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request.OrderItemRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderItemEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.order.OrderItemMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.order.OrderItemRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.measurement.MeasurementService;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.product.ProductSizeService;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse.WarehouseBatchSizeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final WarehouseBatchRepository batchRepository;
    private final OrderItemMapper orderItemMapper;
    private final MeasurementService measurementService;
    private final ProductSizeService productSizeService;
    private final WarehouseBatchSizeService batchSizeService;

    /**
     * ADD ORDER ITEMS TO ORDER
     * This is used when you want to add order items to an existing order.
     * Handles product/batch/custom branching, stock deduction, and measurements.
     */
    @Transactional
    public List<OrderItemEntity> addOrderItemsToOrder(OrderEntity order, List<OrderItemRequestDTO> dtos) {

        List<OrderItemEntity> items = new ArrayList<>();

        for (OrderItemRequestDTO dto : dtos) {

            // Maps only safe fields: quantity, size, customMade, measurementsTaken
            // type, variant, color, unitPrice are intentionally ignored by the mapper
            OrderItemEntity item = orderItemMapper.toEntity(dto);

            // Link this item to its parent order
            item.setOrder(order);

            if (dto.getProductId() != null) {

                // READY-MADE: sourced from product inventory
                ProductEntity product = productRepository.findByProductId(dto.getProductId())
                        .orElseThrow(() -> new NotFoundException("Product not found"));

                item.setProduct(product);

                // Copy inventory snapshot into order item
                item.setType(product.getType());
                item.setVariant(product.getVariant());
                item.setColor(product.getColor());

                // Price comes from product, not from frontend
                item.setUnitPrice(BigDecimal.valueOf(product.getProductPrice()));

                // Deduct stock from the specific size requested
                productSizeService.deductStock(product.getProductId(), dto.getSize(), dto.getQuantity());

            } else if (dto.getBatchId() != null) {

                // READY-MADE: sourced from batch inventory
                WarehouseBatchEntity batch = batchRepository.findByBatchId(dto.getBatchId())
                        .orElseThrow(() -> new NotFoundException("Batch not found"));

                item.setBatch(batch);

                // Copy inventory snapshot into order item
                item.setType(batch.getType());
                item.setVariant(batch.getVariant());
                item.setColor(batch.getColor());

                // Price comes from batch, not from frontend
                item.setUnitPrice(BigDecimal.valueOf(batch.getBatchPrice()));

                // Deduct stock from the specific size requested
                batchSizeService.deductStock(batch.getBatchId(), dto.getSize(), dto.getQuantity());

            } else {

                // CUSTOM-MADE: no inventory exists yet
                item.setType(dto.getType());
                item.setVariant(dto.getVariant());
                item.setColor(dto.getColor());
                item.setUnitPrice(dto.getUnitPrice());
            }

            // Calculate total price for this line item
            BigDecimal totalPrice = item.getUnitPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
            item.setTotalPrice(totalPrice);

            // Save item — measurements require an existing orderItemId in the database
            OrderItemEntity savedItem = orderItemRepository.save(item);

            // Save measurements if provided
            if (dto.getMeasurements() != null && !dto.getMeasurements().isEmpty()) {
                measurementService.createMeasurements(savedItem, dto.getMeasurements());
            }

            items.add(savedItem);
        }

        return items;
    }
}
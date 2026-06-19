package com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchSizeResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchSizeEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.warehouse.WarehouseBatchSizeMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchSizeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseBatchSizeService {

    private final WarehouseBatchSizeRepository batchSizeRepository;
    private final WarehouseBatchRepository batchRepository;
    private final WarehouseBatchSizeMapper batchSizeMapper;

    /**
     * ADD SIZES TO BATCH
     * This is used when you want to add NEW sizes to an existing batch.
     */
    @Transactional
    public List<WarehouseBatchSizeResponseDTO> addSizesToBatch(UUID batchId, List<WarehouseBatchSizeRequestDTO> dtos) {

        // 1. Find parent batch
        WarehouseBatchEntity batch = batchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new NotFoundException("Batch not found"));

        // 2. Convert DTOs → Entities and link each to the parent batch
        List<WarehouseBatchSizeEntity> sizes = new ArrayList<>();

        for (WarehouseBatchSizeRequestDTO dto : dtos) {
            WarehouseBatchSizeEntity size = batchSizeMapper.toEntity(dto);
            size.setBatch(batch);
            sizes.add(size);
        }

        // 3. Save all sizes
        List<WarehouseBatchSizeEntity> savedSizes = batchSizeRepository.saveAll(sizes);

        // 4. Map to response
        return batchSizeMapper.toResponseList(savedSizes);
    }

    /**
     * GET ALL SIZES FOR A BATCH
     */
    public List<WarehouseBatchSizeResponseDTO> getSizesByBatch(UUID batchId) {

        WarehouseBatchEntity batch = batchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new NotFoundException("Batch not found"));

        return batchSizeMapper.toResponseList(batch.getBatchSizes());
    }

    public int calculateBatchTotalQuantity(WarehouseBatchEntity batch) {

        int total = 0;
        for (WarehouseBatchSizeEntity size : batch.getBatchSizes()) {
            total = total + size.getQuantity();
        }
        return total;
    }

    /**
     * Deduct stock from batch

     * Used for:
     * Non-school orders WITHOUT measurements
     */
    public void deductStock(UUID batchId, String size, int quantityToDeduct
    ) {

        WarehouseBatchSizeEntity batchSize = batchSizeRepository.findByBatch_BatchIdAndSize(batchId, size)
                        .orElseThrow(
                                () -> new NotFoundException("Size not found in batch")
                        );

        // Validate stock
        if (batchSize.getQuantity() < quantityToDeduct) {

            throw new RuntimeException("Insufficient stock for size: " + size);
        }

        // Deduct stock
        batchSize.setQuantity(batchSize.getQuantity() - quantityToDeduct);

        batchSizeRepository.save(batchSize);

    /*
        Update batch total quantity
     */
        WarehouseBatchEntity batch = batchSize.getBatch();

        int totalQuantity = calculateBatchTotalQuantity(batch);

        batch.setTotalQuantity(totalQuantity);

        batchRepository.save(batch);
    }
}
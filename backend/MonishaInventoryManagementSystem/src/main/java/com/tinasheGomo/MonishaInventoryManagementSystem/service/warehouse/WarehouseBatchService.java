package com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchSizeEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.DuplicateException;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.product.ProductMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.warehouse.WarehouseBatchMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseBatchService {

    private final WarehouseBatchRepository batchRepository;
    private final WarehouseBatchMapper batchMapper;
    private final WarehouseBatchSizeService batchSizeService;
    private final ProductMapper productMapper;
    private final EntityManager entityManager;

    /**
     * CREATE BATCH
     *
     * Creates a new warehouse batch with its sizes and calculates the totals.
     *
     * Flow:
     *   1. Validate — ensure batch name is unique
     *   2. Map DTO → Entity — basic fields only, sizes are NOT linked yet
     *   3. Save batch — generates a UUID, persists to DB
     *   4. Add sizes — child entities saved with batch reference (FK)
     *   5. Flush + Clear — force pending writes to DB, then discard cached entities
     *   6. Reload batch — fresh load from DB with sizes included
     *   7. Calculate totals — sum all size quantities, compute total price
     *   8. Save final — persist the calculated totals back to the batch
     *
     * @param requestDTO — batch name, type, variant, color, price, sizes
     * @return the created batch with all fields and calculated totals
     * @throws DuplicateException if batch name already exists
     */
    @Transactional
    public WarehouseBatchResponseDTO createWarehouseBatch(WarehouseBatchRequestDTO requestDTO) {

        // ─── Step 1: Prevent duplicates ───────────────────────────────────
        // A batch name must be unique across the system.
        // If a batch with this name already exists, reject the request.
        if (batchRepository.existsByBatchName(requestDTO.getBatchName())) {
            throw new DuplicateException("Batch already exists");
        }

        // ─── Step 2: Map DTO → Entity (basic fields only) ─────────────────
        // MapStruct converts the request DTO into a new entity.
        // batchSizes is explicitly set to an empty list (not null) because:
        //   - The @Mapping ignore on the mapper leaves batchSizes as null
        //   - Hibernate needs a non-null collection to manage the relationship
        //   - A null collection causes NPE when iterating later
        // totalQuantity and totalPrice start at 0, calculated later in step 7.
        WarehouseBatchEntity batch = batchMapper.toEntity(requestDTO);
        batch.setBatchSizes(new ArrayList<>());
        batch.setTotalQuantity(0);
        batch.setTotalPrice(0);
        batch.setCreatedBy(SecurityUtils.getCurrentUser().getUser().getUserName());

        // ─── Step 3: Save batch (generates UUID, persists to DB) ───────────
        // The batch MUST be saved first because:
        //   - Sizes reference the batch via batch_id (foreign key)
        //   - The batch needs a UUID before sizes can be linked
        // After save, savedBatch.getBatchId() returns the generated UUID.
        WarehouseBatchEntity savedBatch = batchRepository.save(batch);

        // ─── Step 4: Add sizes (child entities with batch FK) ──────────────
        // Each size is a separate row in warehouse_batch_size_entity.
        // The service creates entities, sets size.setBatch(batch), and saves all.
        // Note: the batch reference here uses the cached entity from step 3.
        batchSizeService.addSizesToBatch(savedBatch.getBatchId(), requestDTO.getBatchSizes());

        // ─── Step 5: Flush + Clear (critical for data consistency) ─────────
        // WHY flush?  — Hibernate defers SQL writes until flush time.
        //                Without flush, the size inserts from step 4 are only
        //                tracked in memory, not written to the database.
        //                flush() forces ALL pending SQL to execute immediately.
        //
        // WHY clear?  — Hibernate's first-level cache (persistence context)
        //                stores entities by ID. The batch entity from step 3
        //                is cached with batchSizes = [] (empty).
        //                clear() discards ALL cached entities so the next
        //                query loads fresh data from the database.
        //
        // ORDER MATTERS — flush BEFORE clear.
        //   flush() + clear() = writes to DB, then wipes cache = correct
        //   clear() alone     = discards pending writes = DATA LOSS
        entityManager.flush();
        entityManager.clear();

        // ─── Step 6: Reload batch with sizes (fresh from DB) ──────────────
        // Because we cleared the cache in step 5, this query actually hits
        // the database. The returned entity has the correct batchSizes list
        // with all sizes saved in step 4.
        WarehouseBatchEntity updatedBatch = batchRepository.findByBatchId(savedBatch.getBatchId())
                .orElseThrow(() -> new NotFoundException("Batch not found after save"));

        // ─── Step 7: Calculate totals ─────────────────────────────────────
        // Sum all size quantities to get totalQuantity.
        // Multiply totalQuantity × batchPrice to get totalPrice.
        // These values are displayed on the frontend warehouse table.
        int totalQuantity = batchSizeService.calculateBatchTotalQuantity(updatedBatch);
        updatedBatch.setTotalQuantity(totalQuantity);
        updatedBatch.setTotalPrice(totalQuantity * updatedBatch.getBatchPrice());

        // ─── Step 8: Save final batch with calculated totals ───────────────
        // The batch is updated with the correct totals and saved again.
        // This is the final state returned to the frontend.
        WarehouseBatchEntity finalBatch = batchRepository.save(updatedBatch);

        return batchMapper.toResponse(finalBatch);
    }

    @Transactional
    public WarehouseBatchResponseDTO getWarehouseBatchById(UUID batchId) {

        WarehouseBatchEntity batch = batchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new NotFoundException("Batch not found"));

        WarehouseBatchResponseDTO response = batchMapper.toResponse(batch);
        response.setCreatedBy(batch.getCreatedBy());

        // Map products from the batch
        if (batch.getProducts() != null && !batch.getProducts().isEmpty()) {
            List<ProductResponseDTO> productResponses = productMapper.toResponseList(batch.getProducts());
            response.setProducts(productResponses);
        }

        return response;
    }

    public List<WarehouseBatchResponseDTO> getAllWarehouseBatches() {

        List<WarehouseBatchEntity> batches = batchRepository.findAll();
        List<WarehouseBatchResponseDTO> responses = new ArrayList<>();
        for (WarehouseBatchEntity batch : batches) {
            WarehouseBatchResponseDTO response = batchMapper.toResponse(batch);
            response.setCreatedBy(batch.getCreatedBy());
            responses.add(response);
        }
        return responses;
    }

    public void deleteWarehouseBatch(UUID batchId) {

        WarehouseBatchEntity batch = batchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new NotFoundException("Batch not found"));

        batchRepository.delete(batch);
    }
}

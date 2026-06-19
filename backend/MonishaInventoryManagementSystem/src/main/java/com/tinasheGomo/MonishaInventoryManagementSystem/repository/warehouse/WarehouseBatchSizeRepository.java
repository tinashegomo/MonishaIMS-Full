package com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseBatchSizeRepository extends JpaRepository<WarehouseBatchSizeEntity, UUID> {

    List<WarehouseBatchSizeEntity> findByBatch_BatchId(UUID batchId);
    Optional<WarehouseBatchSizeEntity> findByBatch_BatchIdAndSize(UUID batchId, String size);
}

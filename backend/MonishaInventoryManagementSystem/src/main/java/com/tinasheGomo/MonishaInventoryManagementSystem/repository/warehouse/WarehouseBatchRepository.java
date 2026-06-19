package com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseBatchRepository extends JpaRepository<WarehouseBatchEntity, UUID> {

    boolean existsByBatchName(String batchName);

    Optional<WarehouseBatchEntity> findByBatchName(String batchName);

    @EntityGraph(attributePaths = {"batchSizes"})
    Optional<WarehouseBatchEntity> findByBatchId(UUID batchId);

}
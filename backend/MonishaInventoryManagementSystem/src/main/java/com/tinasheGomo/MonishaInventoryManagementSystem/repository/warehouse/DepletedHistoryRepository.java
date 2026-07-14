package com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.DepletedHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DepletedHistoryRepository extends JpaRepository<DepletedHistoryEntity, UUID> {

    List<DepletedHistoryEntity> findByBatchIdOrderByDepletedAtDesc(UUID batchId);
}

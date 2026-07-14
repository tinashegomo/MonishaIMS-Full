package com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.RestockHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RestockHistoryRepository extends JpaRepository<RestockHistoryEntity, UUID> {

    List<RestockHistoryEntity> findByBatchIdOrderByRestockedAtDesc(UUID batchId);
}

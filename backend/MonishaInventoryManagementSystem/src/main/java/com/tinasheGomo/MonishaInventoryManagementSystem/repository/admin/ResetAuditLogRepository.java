package com.tinasheGomo.MonishaInventoryManagementSystem.repository.admin;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.admin.ResetAuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResetAuditLogRepository extends JpaRepository<ResetAuditLogEntity, UUID> {

    List<ResetAuditLogEntity> findAllByOrderByResetAtDesc();
}

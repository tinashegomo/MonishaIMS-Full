package com.tinasheGomo.MonishaInventoryManagementSystem.service.admin;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.admin.response.ResetAuditLogResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.admin.ResetAuditLogEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.admin.ResetAuditLogRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final JdbcTemplate jdbcTemplate;
    private final ResetAuditLogRepository resetAuditLogRepository;

    private static final String[] TABLES_TO_RESET = {
        "measurement_entity",
        "order_item_entity",
        "orders",
        "product_size_entity",
        "product_restock_history_entity",
        "product_depleted_history_entity",
        "product_entity",
        "warehouse_batch_size_entity",
        "restock_history_entity",
        "depleted_history_entity",
        "warehouse_batch_entity",
        "customer_entity",
        "school_entity"
    };

    @Transactional
    public void resetDatabase() {
        String performedBy = SecurityUtils.getCurrentUserEmail();

        List<String> tablesCleared = new ArrayList<>();
        List<String> rowCountParts = new ArrayList<>();

        for (String table : TABLES_TO_RESET) {
            Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM " + table, Long.class
            );
            rowCountParts.add(table + ": " + count);
            tablesCleared.add(table);
        }

        ResetAuditLogEntity auditLog = new ResetAuditLogEntity();
        auditLog.setPerformedBy(performedBy);
        auditLog.setTablesCleared(String.join(", ", tablesCleared));
        auditLog.setRowCounts(String.join(", ", rowCountParts));
        resetAuditLogRepository.save(auditLog);

        for (String table : TABLES_TO_RESET) {
            jdbcTemplate.execute("DELETE FROM " + table);
        }
    }

    public List<ResetAuditLogResponseDTO> getAuditLog() {
        return resetAuditLogRepository.findAllByOrderByResetAtDesc()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    private ResetAuditLogResponseDTO toDTO(ResetAuditLogEntity entity) {
        ResetAuditLogResponseDTO dto = new ResetAuditLogResponseDTO();
        dto.setLogId(entity.getLogId());
        dto.setPerformedBy(entity.getPerformedBy());
        dto.setTablesCleared(entity.getTablesCleared());
        dto.setRowCounts(entity.getRowCounts());
        dto.setResetAt(entity.getResetAt());
        return dto;
    }
}

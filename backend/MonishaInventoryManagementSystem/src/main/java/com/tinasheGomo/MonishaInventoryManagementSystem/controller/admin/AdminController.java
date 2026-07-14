package com.tinasheGomo.MonishaInventoryManagementSystem.controller.admin;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.admin.response.ResetAuditLogResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monishaInventory/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/reset-database")
    public ResponseEntity<String> resetDatabase() {
        adminService.resetDatabase();
        return ResponseEntity.ok("Database reset successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/reset-audit-log")
    public ResponseEntity<List<ResetAuditLogResponseDTO>> getAuditLog() {
        return ResponseEntity.ok(adminService.getAuditLog());
    }
}

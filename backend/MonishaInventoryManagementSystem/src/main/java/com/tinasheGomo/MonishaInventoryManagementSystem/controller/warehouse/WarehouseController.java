package com.tinasheGomo.MonishaInventoryManagementSystem.controller.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchSizeResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse.WarehouseBatchService;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.warehouse.WarehouseBatchSizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/warehouse")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseBatchService warehouseBatchService;
    private final WarehouseBatchSizeService warehouseBatchSizeService;

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping("/create-batch")
    public WarehouseBatchResponseDTO createWarehouseBatch(@RequestBody @Valid WarehouseBatchRequestDTO requestDTO){
        return warehouseBatchService.createWarehouseBatch(requestDTO);
    }

    @GetMapping("/get-batch-byId/{batchId}")
    public WarehouseBatchResponseDTO getWarehouseBatchById(@PathVariable UUID batchId){
        return warehouseBatchService.getWarehouseBatchById(batchId);
    }

    @GetMapping("/get-all-batches")
    public List<WarehouseBatchResponseDTO> getAllWarehouseBatches(){
        return warehouseBatchService.getAllWarehouseBatches();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/delete-batch/{batchId}")
    public void deleteWarehouseBatch(@PathVariable UUID batchId){
        warehouseBatchService.deleteWarehouseBatch(batchId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping("/add-sizes-to-batch/{batchId}")
    public List<WarehouseBatchSizeResponseDTO> addSizesToBatch(
            @PathVariable UUID batchId,
            @RequestBody @Valid List<WarehouseBatchSizeRequestDTO> requestDTOs) {
        return warehouseBatchSizeService.addSizesToBatch(batchId, requestDTOs);
    }
}

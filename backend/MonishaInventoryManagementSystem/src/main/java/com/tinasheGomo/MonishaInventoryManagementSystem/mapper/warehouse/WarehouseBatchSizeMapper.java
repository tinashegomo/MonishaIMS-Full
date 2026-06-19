package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchSizeResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchSizeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarehouseBatchSizeMapper {

    WarehouseBatchSizeEntity toEntity(WarehouseBatchSizeRequestDTO requestDTO);

    WarehouseBatchSizeResponseDTO toResponse(WarehouseBatchSizeEntity batchSize);

    List<WarehouseBatchSizeResponseDTO> toResponseList(List<WarehouseBatchSizeEntity> batchSizes);

    void updateWarehouseBatchSizeFromDTO(
            WarehouseBatchSizeRequestDTO requestDTO,
            @MappingTarget WarehouseBatchSizeEntity batchSize
    );
}
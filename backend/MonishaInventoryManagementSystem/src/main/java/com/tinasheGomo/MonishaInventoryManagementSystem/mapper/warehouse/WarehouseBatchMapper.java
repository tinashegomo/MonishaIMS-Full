package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.warehouse;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.request.WarehouseBatchRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.warehouse.WarehouseBatchEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarehouseBatchMapper {

    @Mapping(target = "batchSizes", ignore = true)
    @Mapping(target = "products", ignore = true)
    WarehouseBatchEntity toEntity(WarehouseBatchRequestDTO requestDTO);

    @Mapping(target = "products", ignore = true)
    WarehouseBatchResponseDTO toResponse(WarehouseBatchEntity batch);

    List<WarehouseBatchResponseDTO> toResponseList(List<WarehouseBatchEntity> batches);

    void updateWarehouseBatchFromDTO(
            WarehouseBatchRequestDTO requestDTO,
            @MappingTarget WarehouseBatchEntity batch
    );
}
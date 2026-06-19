package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.measurement;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement.MeasurementRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement.MeasurementResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.measurement.MeasurementEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MeasurementMapper {

    MeasurementEntity toEntity(MeasurementRequestDTO requestDTO);

    @Mapping(source = "orderItem.orderItemId", target = "orderItemId")
    MeasurementResponseDTO toResponse(MeasurementEntity measurement);

    List<MeasurementResponseDTO> toResponseList(List<MeasurementEntity> measurements);

    void updateMeasurementFromDTO(
            MeasurementRequestDTO requestDTO,
            @MappingTarget MeasurementEntity measurement
    );
}
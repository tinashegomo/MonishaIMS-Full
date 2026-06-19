package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.school;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.school.SchoolRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.school.SchoolResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.school.SchoolEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SchoolMapper {

    SchoolEntity toEntity(SchoolRequestDTO requestDTO);

    SchoolResponseDTO toResponse(SchoolEntity school);

    List<SchoolResponseDTO> toResponseList(List<SchoolEntity> schools);

    void updateSchoolFromDTO(
            SchoolRequestDTO requestDTO,
            @MappingTarget SchoolEntity school
    );
}
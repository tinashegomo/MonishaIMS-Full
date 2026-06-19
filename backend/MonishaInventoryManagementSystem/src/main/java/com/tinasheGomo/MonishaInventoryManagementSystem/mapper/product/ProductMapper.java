package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "productSizes", ignore = true)
    ProductEntity toEntity(ProductRequestDTO requestDTO);

    @Mapping(source = "school.schoolId", target = "schoolId")
    @Mapping(source = "school.schoolName", target = "schoolName")
    @Mapping(source = "batch.batchId", target = "batchId")
    @Mapping(source = "batch.batchName", target = "batchName")
    ProductResponseDTO toResponse(ProductEntity product);

    List<ProductResponseDTO> toResponseList(List<ProductEntity> products);

    void updateProductFromDTO(
            ProductRequestDTO requestDTO,
            @MappingTarget ProductEntity product);
}

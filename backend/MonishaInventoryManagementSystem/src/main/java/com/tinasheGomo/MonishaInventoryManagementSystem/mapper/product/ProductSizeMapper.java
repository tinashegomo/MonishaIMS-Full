package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductSizeRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductSizeResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductSizeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductSizeMapper {

    ProductSizeEntity toEntity(ProductSizeRequestDTO requestDTO);

    ProductSizeResponseDTO toResponse(ProductSizeEntity productSize);

    List<ProductSizeResponseDTO> toResponseList(List<ProductSizeEntity> productsSizes);

    void updateProductSizeFromDTO(ProductSizeRequestDTO requestDTO, @MappingTarget ProductSizeEntity product);
}

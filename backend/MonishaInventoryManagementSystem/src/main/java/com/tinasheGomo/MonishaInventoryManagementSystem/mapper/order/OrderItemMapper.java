package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request.OrderItemRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderItemResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderItemEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.measurement.MeasurementMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = { MeasurementMapper.class })
public interface OrderItemMapper {

    /*
        toEntity — maps only safe fields from the DTO.

        type, variant, color, unitPrice are IGNORED here.
        They must be set manually in the service from inventory,
        not taken from frontend input.

        quantity, size, customMade, measurementsTaken
        are safe to map — they always come from the frontend.
     */
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "variant", ignore = true)
    @Mapping(target = "color", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "batch", ignore = true)
    @Mapping(target = "measurements", ignore = true)
    OrderItemEntity toEntity(OrderItemRequestDTO requestDTO);

    /*
        toResponse — flattens the product and batch relationships
        into simple IDs for the response.
     */
    @Mapping(source = "product.productId", target = "productId")
    @Mapping(source = "batch.batchId", target = "batchId")
    OrderItemResponseDTO toResponse(OrderItemEntity orderItem);

    List<OrderItemResponseDTO> toResponseList(List<OrderItemEntity> orderItems);

    void updateOrderItemFromDTO(
            OrderItemRequestDTO requestDTO,
            @MappingTarget OrderItemEntity orderItem
    );
}
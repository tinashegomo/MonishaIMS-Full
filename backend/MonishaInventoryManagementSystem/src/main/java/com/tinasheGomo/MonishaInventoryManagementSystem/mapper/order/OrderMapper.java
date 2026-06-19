package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request.OrderRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = { OrderItemMapper.class })
public interface OrderMapper {

    /*
        toEntity — maps only safe, simple fields from the DTO.

        Everything below is intentionally ignored:
        - customer and school are relationships, set manually in the service
        - orderItems are built individually in the service via OrderItemService
        - All financial fields (totalAmount, paidAmount, balance, fullyPaid)
          are calculated in the service, not taken from the DTO
        - orderStatus is determined by business logic in the service
        - hasMeasurements is derived from the items in the service
        - schoolOrder is derived from whether schoolId is present
        - orderNumber is generated in the service
     */
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "school", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "paidAmount", ignore = true)
    @Mapping(target = "balance", ignore = true)
    @Mapping(target = "fullyPaid", ignore = true)
    @Mapping(target = "hasMeasurements", ignore = true)
    @Mapping(target = "schoolOrder", ignore = true)
    @Mapping(target = "orderStatus", ignore = true)
    @Mapping(target = "orderNumber", ignore = true)
    OrderEntity toEntity(OrderRequestDTO requestDTO);

    /*
        toResponse — flattens customer and school relationships
        into simple fields for the response DTO.
     */
    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "customer.customerName", target = "customerName")
    @Mapping(source = "school.schoolId", target = "schoolId")
    @Mapping(source = "school.schoolName", target = "schoolName")
    OrderResponseDTO toResponse(OrderEntity order);

    List<OrderResponseDTO> toResponseList(List<OrderEntity> orders);

    void updateOrderFromDTO(
            OrderRequestDTO requestDTO,
            @MappingTarget OrderEntity order
    );
}
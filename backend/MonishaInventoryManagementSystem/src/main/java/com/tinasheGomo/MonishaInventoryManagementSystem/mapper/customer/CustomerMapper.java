package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.customer;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.customer.CustomerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerEntity toEntity(CustomerRequestDTO requestDTO);

    CustomerResponseDTO toResponse(CustomerEntity customer);

    List<CustomerResponseDTO> toResponseList(List<CustomerEntity> customers);

    void updateCustomerFromDTO(
            CustomerRequestDTO requestDTO,
            @MappingTarget CustomerEntity customer
    );
}
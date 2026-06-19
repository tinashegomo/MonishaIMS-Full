package com.tinasheGomo.MonishaInventoryManagementSystem.service.customer;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.customer.CustomerEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.DuplicateException;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.customer.CustomerMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.customer.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final CustomerMapper customerMapper;

    /*
    =========================================================
                    CREATE CUSTOMER
    =========================================================
     */

    public CustomerResponseDTO createCustomer(CustomerRequestDTO requestDTO) {

        boolean customerExists = customerRepository.existsByCustomerName(
                        requestDTO.getCustomerName()
                );

        if (customerExists) {
            throw new DuplicateException(
                    "Customer with this name already exists"
            );
        }

        CustomerEntity customer = customerMapper.toEntity(requestDTO);

        CustomerEntity savedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(savedCustomer);
    }

    /*
    =========================================================
                    GET ALL CUSTOMERS
    =========================================================
     */

    public List<CustomerResponseDTO> getAllCustomers() {

        List<CustomerEntity> customers = customerRepository.findAll();

        return customerMapper.toResponseList(customers);
    }

    /*
    =========================================================
                    GET CUSTOMER BY ID
    =========================================================
     */

    public CustomerResponseDTO getCustomerById(UUID customerId) {

        CustomerEntity customer = customerRepository.findByCustomerId(customerId).orElseThrow(
                                () -> new NotFoundException("Customer not found")
                        );

        return customerMapper.toResponse(customer);
    }

    /*
    =========================================================
                    UPDATE CUSTOMER
    =========================================================
     */

    public CustomerResponseDTO updateCustomer(
            UUID customerId,
            CustomerRequestDTO requestDTO
    ) {

        CustomerEntity customer = customerRepository.findByCustomerId(customerId).orElseThrow(
                                () -> new NotFoundException("Customer not found")
                        );

        boolean customerNameExists = customerRepository.existsByCustomerName(requestDTO.getCustomerName());

        if (customerNameExists && !customer.getCustomerName().equals(requestDTO.getCustomerName())) {
            throw new DuplicateException("Customer Name already exists");
        }

        customerMapper.updateCustomerFromDTO(requestDTO, customer);

        CustomerEntity updatedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(updatedCustomer);
    }

    /*
    =========================================================
                    DELETE CUSTOMER
    =========================================================
     */

    public void deleteCustomer(UUID customerId) {

        CustomerEntity customer = customerRepository.findByCustomerId(customerId).orElseThrow(
                                () -> new NotFoundException("Customer not found")
                        );

        customerRepository.delete(customer);
    }
}

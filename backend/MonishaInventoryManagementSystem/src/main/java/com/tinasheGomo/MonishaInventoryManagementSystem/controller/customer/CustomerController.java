package com.tinasheGomo.MonishaInventoryManagementSystem.controller.customer;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.customer.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // POST /api/customers
    @PostMapping("/create-customer")
    public CustomerResponseDTO createCustomer(
            @Valid @RequestBody CustomerRequestDTO requestDTO
    ) {
        return customerService.createCustomer(requestDTO);
    }

    // GET /api/customers
    @GetMapping("/get-all-customers")
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // GET /api/customers/{customerId}
    @GetMapping("/get-customer-byId/{customerId}")
    public CustomerResponseDTO getCustomerById(
            @PathVariable UUID customerId
    ) {
        return customerService.getCustomerById(customerId);
    }

    // PUT /api/customers/{customerId}
    @PutMapping("/update-customer/{customerId}")
    public CustomerResponseDTO updateCustomer(
            @PathVariable UUID customerId,
            @Valid @RequestBody CustomerRequestDTO requestDTO
    ) {
        return customerService.updateCustomer(customerId, requestDTO);
    }

    // DELETE /api/customers/{customerId}
    @DeleteMapping("/delete-customer/{customerId}")
    public void deleteCustomer(
            @PathVariable UUID customerId
    ) {
        customerService.deleteCustomer(customerId);
    }
}
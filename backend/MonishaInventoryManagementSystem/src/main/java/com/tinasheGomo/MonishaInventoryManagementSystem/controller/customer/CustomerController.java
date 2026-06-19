package com.tinasheGomo.MonishaInventoryManagementSystem.controller.customer;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.customer.CustomerResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.customer.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<CustomerResponseDTO> createCustomer(
            @Valid @RequestBody CustomerRequestDTO requestDTO
    ) {
        CustomerResponseDTO response = customerService.createCustomer(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/customers
    @GetMapping("/get-all-customers")
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> response = customerService.getAllCustomers();
        return ResponseEntity.ok(response);
    }

    // GET /api/customers/{customerId}
    @GetMapping("/get-customer-byId/{customerId}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(
            @PathVariable UUID customerId
    ) {
        CustomerResponseDTO response = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(response);
    }

    // PUT /api/customers/{customerId}
    @PutMapping("/update-customer/{customerId}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable UUID customerId,
            @Valid @RequestBody CustomerRequestDTO requestDTO
    ) {
        CustomerResponseDTO response = customerService.updateCustomer(customerId, requestDTO);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/customers/{customerId}
    @DeleteMapping("/delete-customer/{customerId}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable UUID customerId
    ) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }
}
package com.tinasheGomo.MonishaInventoryManagementSystem.repository.customer;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.customer.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, UUID> {

    Optional<CustomerEntity> findByCustomerId(UUID customerId);

    Optional<CustomerEntity> findByCustomerName(String customerName);

    boolean existsByCustomerName(String customerName);
}
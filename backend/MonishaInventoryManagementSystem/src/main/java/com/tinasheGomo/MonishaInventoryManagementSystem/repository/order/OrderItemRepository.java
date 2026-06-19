package com.tinasheGomo.MonishaInventoryManagementSystem.repository.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, UUID> {

    Optional<OrderItemEntity> findByOrderItemId(UUID orderItemId);
}
package com.tinasheGomo.MonishaInventoryManagementSystem.repository.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

    Optional<OrderEntity> findByOrderId(UUID orderId);

    Optional<OrderEntity> findByOrderNumber(String orderNumber);

    List<OrderEntity> findByOrderStatus(OrderStatus orderStatus);
}

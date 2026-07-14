package com.tinasheGomo.MonishaInventoryManagementSystem.controller.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request.OrderRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.OrderStatus;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.order.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders
    @PostMapping("/create-order")
    public OrderResponseDTO createOrder(
            @Valid @RequestBody OrderRequestDTO requestDTO) {
        return orderService.createOrder(requestDTO);
    }

    // GET /api/orders
    @GetMapping("/get-all-orders")
    public List<OrderResponseDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    // GET /api/orders/{orderId}
    @GetMapping("/get-order-byId/{orderId}")
    public OrderResponseDTO getOrderById(
            @PathVariable UUID orderId) {
        return orderService.getOrderById(orderId);
    }

    // GET /api/orders/status/{status}
    // Example: GET /api/orders/status/PENDING
    @GetMapping("/get-order-byStatus/{status}")
    public List<OrderResponseDTO> getOrdersByStatus(
            @PathVariable OrderStatus status) {
        return orderService.getOrdersByStatus(status);
    }

    // PATCH /api/orders/{orderId}/status
    // Used by staff to move an order through its lifecycle
    // Example: mark IN_PRODUCTION → READY_FOR_COLLECTION when tailoring is done
    @PatchMapping("/update-order-status/{orderId}")
    public OrderResponseDTO updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }
}
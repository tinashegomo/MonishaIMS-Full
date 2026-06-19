package com.tinasheGomo.MonishaInventoryManagementSystem.controller.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request.OrderRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.OrderStatus;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.order.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<OrderResponseDTO> createOrder(
            @Valid @RequestBody OrderRequestDTO requestDTO) {
        OrderResponseDTO response = orderService.createOrder(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/orders
    @GetMapping("/get-all-orders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> response = orderService.getAllOrders();
        return ResponseEntity.ok(response);
    }

    // GET /api/orders/{orderId}
    @GetMapping("/get-order-byId/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable UUID orderId) {
        OrderResponseDTO response = orderService.getOrderById(orderId);
        return ResponseEntity.ok(response);
    }

    // GET /api/orders/status/{status}
    // Example: GET /api/orders/status/PENDING
    @GetMapping("/get-order-byStatus/{status}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(
            @PathVariable OrderStatus status) {
        List<OrderResponseDTO> response = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(response);
    }

    // PATCH /api/orders/{orderId}/status
    // Used by staff to move an order through its lifecycle
    // Example: mark IN_PRODUCTION → READY_FOR_COLLECTION when tailoring is done
    @PatchMapping("/update-order-status/{orderId}")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status) {
        OrderResponseDTO response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }
}
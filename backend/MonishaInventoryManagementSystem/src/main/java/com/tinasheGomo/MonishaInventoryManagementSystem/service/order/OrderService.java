package com.tinasheGomo.MonishaInventoryManagementSystem.service.order;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.request.OrderRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.customer.CustomerEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderItemEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.school.SchoolEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.OrderStatus;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.order.OrderMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.customer.CustomerRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.order.OrderRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.school.SchoolRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final SchoolRepository schoolRepository;
    private final OrderMapper orderMapper;
    private final OrderItemService orderItemService;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {

        // Maps only safe fields: collectionDate, notes
        // everything else is set manually below
        OrderEntity order = orderMapper.toEntity(dto);

        // Fetch and attach customer
        // every order must belong to a customer
        CustomerEntity customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        order.setCustomer(customer);

        // Attach school if provided
        // schoolOrder flag is derived from this — no need for frontend to send it
        if (dto.getSchoolId() != null) {

            SchoolEntity school = schoolRepository.findById(dto.getSchoolId())
                    .orElseThrow(() -> new NotFoundException("School not found"));

            order.setSchool(school);
            order.setSchoolOrder(true);

        } else {

            // No school — this is a general shop order
            order.setSchoolOrder(false);
        }

        // Set financial defaults before saving
        // real values are calculated after items are created
        order.setTotalAmount(BigDecimal.ZERO);
        order.setPaidAmount(BigDecimal.ZERO);
        order.setBalance(BigDecimal.ZERO);
        order.setFullyPaid(false);
        order.setHasMeasurements(false);
        order.setOrderStatus(OrderStatus.PENDING);

        // Generate a unique human-readable order number
        // UUID suffix prevents collisions under high load
        // Example: ORD-1716123456789-3f2a
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" +
                UUID.randomUUID().toString().substring(0, 4);

        order.setOrderNumber(orderNumber);

        // Set createdBy from current authenticated user
        order.setCreatedBy(SecurityUtils.getCurrentUser().getUser().getUserName());

        // Save order first to generate orderId
        // order items need this ID to set their order_id foreign key
        OrderEntity savedOrder = orderRepository.save(order);

        // Create each order item via OrderItemService
        List<OrderItemEntity> items = orderItemService.addOrderItemsToOrder(savedOrder, dto.getOrderItems());

        savedOrder.setOrderItems(items);

        // Calculate total by summing all item totals
        // each item total was already calculated in OrderItemService
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemEntity item : items) {
            total = total.add(item.getTotalPrice());
        }

        // Paid amount cannot exceed what the order is worth
        // prevents accidental overpayment at creation time
        if (dto.getPaidAmount().compareTo(total) > 0) {
            throw new RuntimeException("Paid amount cannot exceed total amount");
        }

        savedOrder.setTotalAmount(total);
        savedOrder.setPaidAmount(dto.getPaidAmount());
        savedOrder.setBalance(total.subtract(dto.getPaidAmount()));

        // Order is fully paid when balance reaches zero
        savedOrder.setFullyPaid(savedOrder.getBalance().compareTo(BigDecimal.ZERO) == 0);

        // Derive hasMeasurements from the items themselves
        // true if ANY item in this order has measurements recorded
        // this is more accurate than a flag sent from the frontend
        boolean hasMeasurements = false;

        for (OrderItemEntity item : items) {
            if (Boolean.TRUE.equals(item.getMeasurementsTaken())) {
                hasMeasurements = true;
                break;
            }
        }

        savedOrder.setHasMeasurements(hasMeasurements);

        // Set order status based on whether any item is custom-made
        // custom-made items need production — so the order goes IN_PRODUCTION
        // ready-made items are available now — so the order stays PENDING
        boolean hasCustomItems = false;

        for (OrderItemEntity item : items) {
            if (Boolean.TRUE.equals(item.getCustomMade())) {
                hasCustomItems = true;
                break;
            }
        }

        if (hasCustomItems) {
            savedOrder.setOrderStatus(OrderStatus.IN_PRODUCTION);
        } else {
            savedOrder.setOrderStatus(OrderStatus.PENDING);
        }

        // Save the final order with all calculated values
        OrderEntity finalOrder = orderRepository.save(savedOrder);

        return orderMapper.toResponse(finalOrder);
    }

    // get all orders
    public List<OrderResponseDTO> getAllOrders() {
        return orderMapper.toResponseList(orderRepository.findAll());
    }

    // get one order by id
    public OrderResponseDTO getOrderById(UUID orderId) {
        OrderEntity order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return orderMapper.toResponse(order);
    }

    // get orders by status — e.g. all PENDING orders
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        return orderMapper.toResponseList(orderRepository.findByOrderStatus(status));
    }

    // update status only — used by staff to move orders through lifecycle
    public OrderResponseDTO updateOrderStatus(UUID orderId, OrderStatus status) {
        OrderEntity order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        order.setOrderStatus(status);
        if (status == OrderStatus.COMPLETED) {
            order.setCollectionDate(LocalDate.now());
        }
        return orderMapper.toResponse(orderRepository.save(order));
    }
}
package com.tinasheGomo.MonishaInventoryManagementSystem.service.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserActivityDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.user.UserEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.DuplicateException;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.order.OrderMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.product.ProductMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.user.UserMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.warehouse.WarehouseBatchMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.order.OrderRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.product.ProductRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.user.UserRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.warehouse.WarehouseBatchRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final WarehouseBatchRepository warehouseBatchRepository;
    private final WarehouseBatchMapper warehouseBatchMapper;

    // Get current logged in user
    public UserResponseDTO getCurrentLoggedInUser() {

        UserEntity user = SecurityUtils.getCurrentUser().getUser();

        return userMapper.toResponse(user);
    }

    // Get current logged in user role
    public UserRole getCurrentLoggedInUserRole() {

        return SecurityUtils.getCurrentUserRole();
    }

    // Get a single user by id
    public UserResponseDTO getUserById(UUID id) {

        UserEntity user = userRepository.findById(id).orElseThrow(
                () -> new NotFoundException("User not found"));

        return userMapper.toResponse(user);
    }

    // Get all users
    public List<UserResponseDTO> getAllUsers() {

        List<UserEntity> users = userRepository.findAll();

        return userMapper.toResponseList(users);
    }

    // Delete user
    public void deleteUserById(UUID id) {

        UserEntity user = userRepository.findById(id).orElseThrow(
                () -> new NotFoundException("User not found"));

        userRepository.delete(user);
    }

    // Update user role
    public UserResponseDTO updateUserRole(UUID userId, UserRole userRole) {
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(
                () -> new NotFoundException("User not found"));

        user.setUserRole(userRole);
        UserEntity updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    // Change password
    public void changePassword(UUID userId, String newPassword) {
        UserEntity user = userRepository.findById(userId).orElseThrow(
                () -> new NotFoundException("User not found"));

        user.setUserPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Update user details (name, email, phone)
    public UserResponseDTO updateUser(UUID id, String userName, String userEmail, String userPhoneNumber) {
        UserEntity user = userRepository.findById(id).orElseThrow(
                () -> new NotFoundException("User not found"));

        if (!user.getUserEmail().equals(userEmail) && userRepository.existsByUserEmail(userEmail)) {
            throw new DuplicateException("Email already in use");
        }
        if (!user.getUserName().equals(userName) && userRepository.existsByUserName(userName)) {
            throw new DuplicateException("Username already in use");
        }

        user.setUserName(userName);
        user.setUserEmail(userEmail);
        user.setUserPhoneNumber(userPhoneNumber);
        UserEntity updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    // Get user activity (orders, products, batches created)
    public UserActivityDTO getUserActivity(UUID userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(
                () -> new NotFoundException("User not found"));

        String creatorName = user.getUserName();

        // Orders
        List<OrderResponseDTO> userOrders = orderMapper.toResponseList(orderRepository.findAll()).stream()
                .filter(o -> creatorName.equals(o.getCreatedBy()))
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();

        // Products
        List<ProductResponseDTO> userProducts = productMapper.toResponseList(productRepository.findAll()).stream()
                .filter(p -> creatorName.equals(p.getCreatedBy()))
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();

        // Batches
        List<WarehouseBatchResponseDTO> userBatches = warehouseBatchMapper.toResponseList(warehouseBatchRepository.findAll()).stream()
                .filter(b -> creatorName.equals(b.getCreatedBy()))
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();

        UserActivityDTO activity = new UserActivityDTO();
        activity.setUser(userMapper.toResponse(user));
        activity.setTotalOrdersCreated(userOrders.size());
        activity.setTotalProductsCreated(userProducts.size());
        activity.setTotalBatchesCreated(userBatches.size());
        activity.setRecentOrders(userOrders.stream().limit(10).toList());
        activity.setRecentProducts(userProducts.stream().limit(10).toList());
        activity.setRecentBatches(userBatches.stream().limit(10).toList());

        return activity;
    }
}

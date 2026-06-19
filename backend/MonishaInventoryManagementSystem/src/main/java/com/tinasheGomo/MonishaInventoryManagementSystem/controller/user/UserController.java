package com.tinasheGomo.MonishaInventoryManagementSystem.controller.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserActivityDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/monishaInventory/user/get-current-user
    @GetMapping("/get-current-user")
    public ResponseEntity<UserResponseDTO> getCurrentLoggedInUser() {
        UserResponseDTO response = userService.getCurrentLoggedInUser();
        return ResponseEntity.ok(response);
    }

    // GET /api/monishaInventory/user/get-current-user-role
    @GetMapping("/get-current-user-role")
    public ResponseEntity<UserRole> getCurrentLoggedInUserRole() {
        UserRole response = userService.getCurrentLoggedInUserRole();
        return ResponseEntity.ok(response);
    }

    // GET /api/monishaInventory/user/get-all-users
    @GetMapping("/get-all-users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> response = userService.getAllUsers();
        return ResponseEntity.ok(response);
    }

    // GET /api/monishaInventory/user/get-user-byId/{id}
    @GetMapping("/get-user-byId/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable UUID id) {
        UserResponseDTO response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/monishaInventory/user/delete-user/{id}
    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<Void> deleteUserById(
            @PathVariable UUID id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/monishaInventory/user/update-user-role/{userId}
    @PutMapping("/update-user-role/{userId}")
    public ResponseEntity<UserResponseDTO> updateUserRole(
            @PathVariable UUID userId,
            @RequestParam UserRole userRole) {
        UserResponseDTO response = userService.updateUserRole(userId, userRole);
        return ResponseEntity.ok(response);
    }

    // PATCH /api/monishaInventory/user/change-password
    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestParam String newPassword) {
        UUID userId = SecurityUtils.getCurrentUser().getUser().getUserId();
        userService.changePassword(userId, newPassword);
        return ResponseEntity.ok().build();
    }

    // PATCH /api/monishaInventory/user/update-user/{id}
    @PatchMapping("/update-user/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO response = userService.updateUser(
                id,
                requestDTO.getUserName(),
                requestDTO.getUserEmail(),
                requestDTO.getUserPhoneNumber()
        );
        return ResponseEntity.ok(response);
    }

    // GET /api/monishaInventory/user/get-user-activity/{id}
    @GetMapping("/get-user-activity/{id}")
    public ResponseEntity<UserActivityDTO> getUserActivity(
            @PathVariable UUID id) {
        UserActivityDTO response = userService.getUserActivity(id);
        return ResponseEntity.ok(response);
    }
}

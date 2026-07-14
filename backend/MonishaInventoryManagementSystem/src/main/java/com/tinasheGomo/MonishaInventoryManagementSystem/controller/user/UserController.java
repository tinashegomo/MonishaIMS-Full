package com.tinasheGomo.MonishaInventoryManagementSystem.controller.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserActivityDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.SecurityUtils;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public UserResponseDTO getCurrentLoggedInUser() {
        return userService.getCurrentLoggedInUser();
    }

    // GET /api/monishaInventory/user/get-current-user-role
    @GetMapping("/get-current-user-role")
    public UserRole getCurrentLoggedInUserRole() {
return userService.getCurrentLoggedInUserRole();
    }

    // GET /api/monishaInventory/user/get-all-users
    @GetMapping("/get-all-users")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET /api/monishaInventory/user/get-user-byId/{id}
    @GetMapping("/get-user-byId/{id}")
    public UserResponseDTO getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    // DELETE /api/monishaInventory/user/delete-user/{id}
    @DeleteMapping("/delete-user/{id}")
    public void deleteUserById(@PathVariable UUID id) {
        userService.deleteUserById(id);
    }

    // PATCH /api/monishaInventory/user/update-user-role/{userId}
    @PatchMapping("/update-user-role/{userId}")
    public UserResponseDTO updateUserRole(@PathVariable UUID userId, @RequestParam UserRole userRole) {
        return userService.updateUserRole(userId, userRole);
    }

    // PATCH /api/monishaInventory/user/change-password
    @PatchMapping("/change-password")
    public void changePassword(@RequestParam String newPassword) {
        UUID userId = SecurityUtils.getCurrentUser().getUser().getUserId();
        userService.changePassword(userId, newPassword);
    }

    // PATCH /api/monishaInventory/user/update-user/{id}
    @PatchMapping("/update-user/{id}")
    public UserResponseDTO updateUser(@PathVariable UUID id, @Valid @RequestBody UserRequestDTO requestDTO) {
        return userService.updateUser(id, requestDTO.getUserName(), requestDTO.getUserEmail(), requestDTO.getUserPhoneNumber());
    }

    // GET /api/monishaInventory/user/get-user-activity/{id}
    @GetMapping("/get-user-activity/{id}")
    public UserActivityDTO getUserActivity(@PathVariable UUID id) {
        return userService.getUserActivity(id);
    }
}

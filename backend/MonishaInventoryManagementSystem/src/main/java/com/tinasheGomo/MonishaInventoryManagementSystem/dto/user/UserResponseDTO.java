package com.tinasheGomo.MonishaInventoryManagementSystem.dto.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class UserResponseDTO {

    private UUID userId;

    private String userName;

    private String userEmail;

    private UserRole userRole;

    private String userPhoneNumber;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

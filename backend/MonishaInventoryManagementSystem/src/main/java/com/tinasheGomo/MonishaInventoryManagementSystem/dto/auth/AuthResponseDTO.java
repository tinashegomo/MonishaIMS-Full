package com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth;

import java.util.UUID;

import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;

    private UUID userId;

    private String userName;

    private String userEmail;

    private UserRole userRole;
}

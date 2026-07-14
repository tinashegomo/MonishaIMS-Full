package com.tinasheGomo.MonishaInventoryManagementSystem.controller.auth;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth.AuthRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth.AuthResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/monishaInventory/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public AuthResponseDTO register(
            @Valid @RequestBody UserRequestDTO requestDTO
    ) {
        return authService.register(requestDTO);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public AuthResponseDTO login(
            @Valid @RequestBody AuthRequestDTO requestDTO
    ) {
        return authService.login(requestDTO);
    }
}
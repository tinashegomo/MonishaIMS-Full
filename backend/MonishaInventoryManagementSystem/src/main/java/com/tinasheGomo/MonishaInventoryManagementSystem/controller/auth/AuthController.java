package com.tinasheGomo.MonishaInventoryManagementSystem.controller.auth;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth.AuthRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth.AuthResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/monishaInventory/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody UserRequestDTO requestDTO
    ) {
        AuthResponseDTO response = authService.register(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody AuthRequestDTO requestDTO
    ) {
        AuthResponseDTO response = authService.login(requestDTO);
        return ResponseEntity.ok(response);
    }
}
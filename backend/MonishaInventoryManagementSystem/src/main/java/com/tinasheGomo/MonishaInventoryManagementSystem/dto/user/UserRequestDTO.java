package com.tinasheGomo.MonishaInventoryManagementSystem.dto.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {

    @NotBlank(message = "Username is required")
    private String userName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String userEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String userPassword;

    private UserRole userRole;

    @NotBlank(message = "Phone number is required")
    private String userPhoneNumber;
}

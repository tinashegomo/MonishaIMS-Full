package com.tinasheGomo.MonishaInventoryManagementSystem.security;

import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    public static Authentication getUserAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static AuthUser getCurrentUser() {
        return (AuthUser) getUserAuthentication().getPrincipal();
    }

    public static String getCurrentUserEmail() {
        return getCurrentUser().getUsername();
    }

    public static UserRole getCurrentUserRole() {
        return getCurrentUser().getRole();
    }
}

package com.tinasheGomo.MonishaInventoryManagementSystem.config;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.user.UserEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // only seed if no admin exists yet
        boolean adminExists = userRepository.existsByUserRole(UserRole.ADMIN);
        if (!adminExists) {
            UserEntity admin = new UserEntity();
            admin.setUserName("Tinashe Gomo");
            admin.setUserEmail("tinashegomo96@gmail.com");
            admin.setUserPassword(passwordEncoder.encode("Tinashe@123"));
            admin.setUserRole(UserRole.ADMIN);
            admin.setUserPhoneNumber("0774964677");
            userRepository.save(admin);
            System.out.println("Default admin seeded");
        }
    }
}

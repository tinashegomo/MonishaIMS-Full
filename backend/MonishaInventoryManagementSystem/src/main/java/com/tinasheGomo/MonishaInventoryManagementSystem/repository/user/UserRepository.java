package com.tinasheGomo.MonishaInventoryManagementSystem.repository.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.user.UserEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByUserEmail(String userEmail);

    Optional<UserEntity> findByUserId(UUID userId);

    boolean existsByUserEmail(String userEmail);

    boolean existsByUserName(String userName);

    boolean existsByUserRole(UserRole userRole);

}

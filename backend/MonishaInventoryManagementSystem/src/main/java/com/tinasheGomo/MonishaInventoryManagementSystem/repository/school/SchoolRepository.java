package com.tinasheGomo.MonishaInventoryManagementSystem.repository.school;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.school.SchoolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<SchoolEntity, UUID> {

    boolean existsBySchoolName(String schoolName);

    Optional<SchoolEntity> findBySchoolName(String schoolName);

    Optional<SchoolEntity> findBySchoolId(UUID schoolId);
}
package com.tinasheGomo.MonishaInventoryManagementSystem.dto.school;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class SchoolResponseDTO {

    private UUID schoolId;

    private String schoolName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

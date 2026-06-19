package com.tinasheGomo.MonishaInventoryManagementSystem.service.school;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.school.SchoolRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.school.SchoolResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.school.SchoolEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.DuplicateException;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.school.SchoolMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.school.SchoolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;

    public SchoolResponseDTO createSchool(SchoolRequestDTO requestDTO){

        // DuplicateException thrown here — GlobalExceptionHandler catches it → 409 CONFLICT
        if (schoolRepository.existsBySchoolName(requestDTO.getSchoolName())) {
            throw new DuplicateException("Duplicate school with this name found");
        }

        SchoolEntity school = schoolMapper.toEntity(requestDTO);

        SchoolEntity savedSchool = schoolRepository.save(school);

        return schoolMapper.toResponse(savedSchool);
    }

    public SchoolResponseDTO getSchoolById(UUID schoolId){
        SchoolEntity school = schoolRepository.findBySchoolId(schoolId).orElseThrow(
                () -> new NotFoundException("School not found")
        );

        return schoolMapper.toResponse(school);
    }

    public List<SchoolResponseDTO> getAllSchools(){
        List<SchoolEntity> schools = schoolRepository.findAll();
        return schoolMapper.toResponseList(schools);
    }

    public SchoolResponseDTO updateSchool(UUID schoolId,SchoolRequestDTO requestDTO){

        SchoolEntity school = schoolRepository.findBySchoolId(schoolId).orElseThrow(
                () -> new NotFoundException("School not found")
        );

        schoolMapper.updateSchoolFromDTO(requestDTO,school);

        SchoolEntity updatedSchool = schoolRepository.save(school);

        return schoolMapper.toResponse(updatedSchool);
    }

    public void deleteSchool(UUID schoolId){

        SchoolEntity school = schoolRepository.findBySchoolId(schoolId).orElseThrow(
                () -> new NotFoundException("School not found")
        );

        schoolRepository.delete(school);
    }
}

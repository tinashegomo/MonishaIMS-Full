package com.tinasheGomo.MonishaInventoryManagementSystem.controller.school;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.school.SchoolRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.school.SchoolResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.school.SchoolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/school")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping("/create-school")
    public SchoolResponseDTO createSchool(@RequestBody @Valid SchoolRequestDTO requestDTO){
        return schoolService.createSchool(requestDTO);
    }

    @GetMapping("/get-school-byId/{schoolId}")
    public SchoolResponseDTO getSchoolById(@PathVariable UUID schoolId){
        return schoolService.getSchoolById(schoolId);
    }

    @GetMapping("/get-all-schools")
    public List<SchoolResponseDTO> getAllSchools(){
        return schoolService.getAllSchools();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping("/update-school/{schoolId}")
    public SchoolResponseDTO updateSchool(@PathVariable UUID schoolId,
                                          @RequestBody @Valid SchoolRequestDTO requestDTO){
        return schoolService.updateSchool(schoolId,requestDTO);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/delete-school/{schoolId}")
    public void deleteSchool(@PathVariable UUID schoolId){
        schoolService.deleteSchool(schoolId);
    }
}

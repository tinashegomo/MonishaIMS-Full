package com.tinasheGomo.MonishaInventoryManagementSystem.mapper.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserEntity toEntity(UserRequestDTO requestDTO);

    UserResponseDTO toResponse(UserEntity user);

    List<UserResponseDTO> toResponseList(List<UserEntity> users);

    void updateUserFromDTO(
            UserRequestDTO requestDTO,
            @MappingTarget UserEntity user
    );
}

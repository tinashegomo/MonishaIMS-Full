package com.tinasheGomo.MonishaInventoryManagementSystem.service.auth;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth.AuthRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.auth.AuthResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.user.UserRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.user.UserEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.DuplicateException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.user.UserMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.user.UserRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.security.JWTUtils;
import com.tinasheGomo.MonishaInventoryManagementSystem.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final JWTUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    public AuthResponseDTO register(UserRequestDTO requestDTO) {

        if(userRepository.existsByUserEmail(requestDTO.getUserEmail())) {
            throw new DuplicateException("Email already exists");
        }

        if(userRepository.existsByUserName(requestDTO.getUserName())) {
            throw new DuplicateException("Username already exists");
        }

        UserEntity user = userMapper.toEntity(requestDTO);

        user.setUserRole(UserRole.USER);

        user.setUserPassword(
                passwordEncoder.encode(requestDTO.getUserPassword())
        );

        UserEntity savedUser = userRepository.save(user);

        String token = jwtUtils.generateToken(savedUser.getUserEmail());

        return new AuthResponseDTO(
                token,
                savedUser.getUserId(),
                savedUser.getUserName(),
                savedUser.getUserEmail(),
                savedUser.getUserRole()
        );
    }

    public AuthResponseDTO login(AuthRequestDTO requestDTO) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDTO.getEmail(),
                        requestDTO.getPassword()
                )
        );

        UserEntity user = userRepository.findByUserEmail(requestDTO.getEmail()).orElseThrow(
                () -> new RuntimeException("Invalid credentials"
                )
        );

        String token = jwtUtils.generateToken(user.getUserEmail());

        return new AuthResponseDTO(
                token,
                user.getUserId(),
                user.getUserName(),
                user.getUserEmail(),
                user.getUserRole()
        );
    }

}

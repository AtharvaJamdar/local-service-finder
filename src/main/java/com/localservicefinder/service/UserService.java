package com.localservicefinder.service;

import com.localservicefinder.dto.UserRegistrationRequest;
import com.localservicefinder.dto.UserResponse;
import com.localservicefinder.entity.User;
import com.localservicefinder.enums.Role;
import com.localservicefinder.exception.EmailAlreadyExistsException;
import com.localservicefinder.exception.PhoneAlreadyExistsException;
import com.localservicefinder.mapper.UserMapper;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    /**
     * Registers a new user after validating unique email and phone number.
     * Password is encrypted before storing the user in the database.
     */
    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new PhoneAlreadyExistsException("Phone number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .build();

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }
}

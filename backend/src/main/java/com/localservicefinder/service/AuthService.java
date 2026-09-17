package com.localservicefinder.service;

import com.localservicefinder.dto.login.AuthResponse;
import com.localservicefinder.dto.login.LoginRequest;
import com.localservicefinder.enums.RegistrationRole;
import com.localservicefinder.dto.UserRegistrationRequest;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.entity.User;
import com.localservicefinder.enums.Role;
import com.localservicefinder.enums.ProviderStatus;
import com.localservicefinder.exception.EmailAlreadyExistsException;
import com.localservicefinder.repository.ProviderProfileRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        // RegistrationRole only has CUSTOMER/PROVIDER — there is no ADMIN
        // value to map here, so this line can never create an admin.
        Role role = request.getRole() == RegistrationRole.PROVIDER ? Role.PROVIDER : Role.CUSTOMER;

        User user = User.builder()
                .fullName(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        if (role == Role.PROVIDER) {
            createProviderProfile(savedUser, request);
        }

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after successful authentication"));

        return buildAuthResponse(user);
    }

    // Providers need a business name and a real location — customers don't
// have these fields at all, so they can't be @NotBlank/@NotNull directly
// on the shared DTO; checked here instead, only when role = PROVIDER.
    private void createProviderProfile(User user, UserRegistrationRequest request) {
        if (request.getBusinessName() == null || request.getBusinessName().isBlank()) {
            throw new IllegalArgumentException("Business name is required when registering as a provider");
        }

        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalArgumentException("Business location (latitude and longitude) is required when registering as a provider");
        }

        if (request.getLatitude() < -90 || request.getLatitude() > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }

        if (request.getLongitude() < -180 || request.getLongitude() > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }

        ProviderProfile profile = ProviderProfile.builder()
                .userId(user.getId())
                .businessName(request.getBusinessName())
                .address(request.getAddress())
                .latitude(java.math.BigDecimal.valueOf(request.getLatitude()))
                .longitude(java.math.BigDecimal.valueOf(request.getLongitude()))
                .isVerified(false)
                .status(ProviderStatus.PENDING)
                .build();

        providerProfileRepository.save(profile);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
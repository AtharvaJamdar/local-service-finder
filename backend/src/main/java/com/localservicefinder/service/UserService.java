package com.localservicefinder.service;

import com.localservicefinder.dto.user.UserProfileResponse;
import com.localservicefinder.dto.user.UserProfileUpdateRequest;
import com.localservicefinder.entity.User;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getMyProfile(Long userId) {
        User user = findUserOrThrow(userId);
        return toProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateMyProfile(Long userId, UserProfileUpdateRequest request) {
        User user = findUserOrThrow(userId);

        // Only overwrite a field if the request actually sent one — this
        // lets the client send a partial update (e.g. just a new phone
        // number) without wiping out the fields it left blank.
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getLatitude() != null) {
            user.setLatitude(BigDecimal.valueOf(request.getLatitude()));
        }
        if (request.getLongitude() != null) {
            user.setLongitude(BigDecimal.valueOf(request.getLongitude()));
        }

        User saved = userRepository.save(user);
        return toProfileResponse(saved);
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .latitude(user.getLatitude() != null ? user.getLatitude().doubleValue() : null)
                .longitude(user.getLongitude() != null ? user.getLongitude().doubleValue() : null)
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
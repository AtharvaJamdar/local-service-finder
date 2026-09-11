package com.localservicefinder.service;

import com.localservicefinder.dto.provider.ProviderProfileResponse;
import com.localservicefinder.dto.provider.ProviderProfileUpdateRequest;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderProfileRepository providerProfileRepository;

    public ProviderProfileResponse getMyProfile(Long loggedInUserId) {
        ProviderProfile profile = findByUserIdOrThrow(loggedInUserId);
        return toResponse(profile);
    }

    @Transactional
    public ProviderProfileResponse updateMyProfile(Long loggedInUserId, ProviderProfileUpdateRequest request) {
        ProviderProfile profile = findByUserIdOrThrow(loggedInUserId);

        // Same partial-update pattern as UserService — only overwrite
        // fields the request actually sent.
        if (request.getBusinessName() != null) {
            profile.setBusinessName(request.getBusinessName());
        }
        if (request.getAddress() != null) {
            profile.setAddress(request.getAddress());
        }
        if (request.getLatitude() != null) {
            profile.setLatitude(BigDecimal.valueOf(request.getLatitude()));
        }
        if (request.getLongitude() != null) {
            profile.setLongitude(BigDecimal.valueOf(request.getLongitude()));
        }

        ProviderProfile saved = providerProfileRepository.save(profile);
        return toResponse(saved);
    }

    private ProviderProfile findByUserIdOrThrow(Long loggedInUserId) {
        return providerProfileRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No provider profile found for this account"));
    }

    private ProviderProfileResponse toResponse(ProviderProfile profile) {
        return ProviderProfileResponse.builder()
                .id(profile.getId())
                .businessName(profile.getBusinessName())
                .address(profile.getAddress())
                .latitude(profile.getLatitude() != null ? profile.getLatitude().doubleValue() : null)
                .longitude(profile.getLongitude() != null ? profile.getLongitude().doubleValue() : null)
                .isVerified(profile.getIsVerified())
                .status(profile.getStatus())
                .build();
    }
}
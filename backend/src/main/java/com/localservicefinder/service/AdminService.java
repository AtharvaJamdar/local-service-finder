package com.localservicefinder.service;

import com.localservicefinder.dto.admin.ProviderAdminResponse;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.entity.User;
import com.localservicefinder.enums.ProviderStatus;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ProviderProfileRepository;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    public List<ProviderAdminResponse> getPendingProviders() {
        return providerProfileRepository.findByStatus(ProviderStatus.PENDING)
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public ProviderAdminResponse approveProvider(Long providerId) {
        return updateStatus(providerId, ProviderStatus.APPROVED);
    }

    @Transactional
    public ProviderAdminResponse rejectProvider(Long providerId) {
        return updateStatus(providerId, ProviderStatus.SUSPENDED);
    }

    private ProviderAdminResponse updateStatus(Long providerId, ProviderStatus newStatus) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        profile.setStatus(newStatus);
        // isVerified only means "an admin has actually reviewed this one" —
        // it flips true on either approve or reject, never back to false.
        profile.setIsVerified(true);

        ProviderProfile saved = providerProfileRepository.save(profile);
        return toAdminResponse(saved);
    }

    private ProviderAdminResponse toAdminResponse(ProviderProfile profile) {
        User owner = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner user not found for provider " + profile.getId()));

        return ProviderAdminResponse.builder()
                .providerId(profile.getId())
                .userId(owner.getId())
                .fullName(owner.getFullName())
                .email(owner.getEmail())
                .businessName(profile.getBusinessName())
                .address(profile.getAddress())
                .status(profile.getStatus())
                .build();
    }
}
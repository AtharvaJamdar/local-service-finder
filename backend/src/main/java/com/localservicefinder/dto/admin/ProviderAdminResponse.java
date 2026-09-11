package com.localservicefinder.dto.admin;

import com.localservicefinder.enums.ProviderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderAdminResponse {

    private Long providerId;
    private Long userId;
    private String fullName;   // from User — the owner's name
    private String email;      // from User — the owner's email
    private String businessName;
    private String address;
    private ProviderStatus status;
}
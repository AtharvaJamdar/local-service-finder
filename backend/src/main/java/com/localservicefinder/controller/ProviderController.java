package com.localservicefinder.controller;

import com.localservicefinder.dto.provider.ProviderProfileResponse;
import com.localservicefinder.dto.provider.ProviderProfileUpdateRequest;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    // PROVIDER ONLY — unlike /users/me, a CUSTOMER has no ProviderProfile
    // row to view, so this is locked to the PROVIDER role, not just "logged in."
    @GetMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserPrincipal me) {

        return ResponseEntity.ok(
                ApiResponse.success("Your provider profile", providerService.getMyProfile(me.getId())));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal me,
            @Valid @RequestBody ProviderProfileUpdateRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Provider profile updated", providerService.updateMyProfile(me.getId(), request)));
    }
}
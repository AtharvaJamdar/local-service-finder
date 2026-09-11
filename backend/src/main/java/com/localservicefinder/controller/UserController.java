package com.localservicefinder.controller;

import com.localservicefinder.dto.user.UserProfileResponse;
import com.localservicefinder.dto.user.UserProfileUpdateRequest;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Any logged-in user (customer, provider, or admin) can view their own profile.
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserPrincipal me) {

        return ResponseEntity.ok(
                ApiResponse.success("Your profile", userService.getMyProfile(me.getId())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal me,
            @Valid @RequestBody UserProfileUpdateRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Profile updated", userService.updateMyProfile(me.getId(), request)));
    }
}
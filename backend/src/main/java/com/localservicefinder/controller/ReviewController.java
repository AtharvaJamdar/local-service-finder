package com.localservicefinder.controller;

import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.dto.review.ReviewRequest;
import com.localservicefinder.dto.review.ReviewResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // CUSTOMER ONLY — leave a review on one of THEIR OWN completed bookings.
    @PostMapping("/bookings/{bookingId}/reviews")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> create(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewRequest request) {

        ReviewResponse response = reviewService.create(me.getId(), bookingId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted", response));
    }

    // PUBLIC — anyone browsing a provider can see their reviews before booking.
    @GetMapping("/providers/{providerId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getByProvider(
            @PathVariable Long providerId) {

        return ResponseEntity.ok(
                ApiResponse.success("Reviews fetched", reviewService.getByProvider(providerId)));
    }
}
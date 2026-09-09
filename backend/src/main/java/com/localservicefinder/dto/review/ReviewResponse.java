package com.localservicefinder.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long bookingId;

    private Long customerId;
    private String customerName;

    private Long providerId;

    private Integer rating;
    private String comment;

    private LocalDateTime createdAt;
}
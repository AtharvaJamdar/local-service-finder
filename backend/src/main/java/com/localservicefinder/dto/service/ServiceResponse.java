package com.localservicefinder.dto.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ServiceResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Boolean isActive;

    private Long providerId;
    private String providerName;
    private String providerPhone;
    private Double providerLatitude;
    private Double providerLongitude;
    private Double providerRatingAverage;
    private Integer providerReviewCount;
    private Long categoryId;
    private String categoryName;

    private LocalDateTime createdAt;
}
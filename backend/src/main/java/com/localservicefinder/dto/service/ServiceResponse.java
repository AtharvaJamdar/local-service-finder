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
    private Long categoryId;
    private String categoryName;

    private LocalDateTime createdAt;
}
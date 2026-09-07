package com.localservicefinder.dto.booking;

import com.localservicefinder.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private Long customerId;
    private String customerName;

    private Long providerId;
    private String providerBusinessName;

    private Long serviceId;
    private String serviceTitle;

    private BookingStatus status;
    private Boolean isEmergency;
    private LocalDateTime scheduledAt;
    private String address;
    private BigDecimal amount;

    private LocalDateTime createdAt;
}
package com.localservicefinder.dto.admin;

import com.localservicefinder.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAdminResponse {

    private Long id;
    private String customerName;
    private String providerBusinessName;
    private String serviceTitle;
    private BookingStatus status;
    private Boolean isEmergency;
    private LocalDateTime scheduledAt;
    private String address;
    private BigDecimal amount;
    private LocalDateTime createdAt;
}
package com.localservicefinder.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUsers;
    private long totalProviders;
    private long pendingProviders;
    private long totalBookings;
    private long completedBookings;
    private BigDecimal totalRevenue;
}
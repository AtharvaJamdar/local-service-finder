// PaymentResponse.java — payment status output
package com.localservicefinder.dto.payment;

import com.localservicefinder.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long bookingId;
    private PaymentStatus status;
    private BigDecimal amount;
    private LocalDateTime paidAt;
}
// PaymentOrderResponse.java — what the frontend needs to open the Razorpay checkout popup
package com.localservicefinder.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class PaymentOrderResponse {

    private Long bookingId;
    private String razorpayOrderId;
    private String razorpayKeyId; // public key, safe to expose to frontend
    private BigDecimal amount;
    private String currency;
}
package com.localservicefinder.controller;

import com.localservicefinder.dto.payment.PaymentOrderResponse;
import com.localservicefinder.dto.payment.PaymentResponse;
import com.localservicefinder.dto.payment.PaymentVerifyRequest;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings/{bookingId}/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // CUSTOMER ONLY — step 1: create a Razorpay order for this booking.
    @PostMapping("/order")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable Long bookingId) {

        PaymentOrderResponse response = paymentService.createOrder(me.getId(), bookingId);
        return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
    }

    // CUSTOMER ONLY — step 2: verify the payment after checkout succeeds.
    @PostMapping("/verify")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> verify(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable Long bookingId,
            @Valid @RequestBody PaymentVerifyRequest request) {

        PaymentResponse response = paymentService.verify(me.getId(), bookingId, request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified", response));
    }


}
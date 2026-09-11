package com.localservicefinder.service;

import com.localservicefinder.dto.payment.PaymentOrderResponse;
import com.localservicefinder.dto.payment.PaymentResponse;
import com.localservicefinder.dto.payment.PaymentVerifyRequest;
import com.localservicefinder.entity.Booking;
import com.localservicefinder.entity.Payment;
import com.localservicefinder.enums.BookingStatus;
import com.localservicefinder.enums.PaymentStatus;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @Transactional
    public PaymentOrderResponse createOrder(Long customerUserId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUserId().equals(customerUserId)) {
            throw new AccessDeniedException("You can only pay for your own bookings");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "This booking must be CONFIRMED by the provider before you can pay");
        }

        paymentRepository.findByBookingId(bookingId).ifPresent(existing -> {
            if (existing.getStatus() == PaymentStatus.PAID) {
                throw new IllegalArgumentException("This booking has already been paid");
            }
        });

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            long amountInPaise = booking.getAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + booking.getId());

            Order order = client.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            Payment payment = paymentRepository.findByBookingId(bookingId)
                    .orElse(Payment.builder().bookingId(bookingId).build());

            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setAmount(booking.getAmount());
            payment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);

            return PaymentOrderResponse.builder()
                    .bookingId(booking.getId())
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayKeyId(razorpayKeyId)
                    .amount(booking.getAmount())
                    .currency("INR")
                    .build();

        } catch (RazorpayException e) {
            throw new IllegalArgumentException("Could not create payment order: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponse verify(Long customerUserId, Long bookingId, PaymentVerifyRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUserId().equals(customerUserId)) {
            throw new AccessDeniedException("You can only pay for your own bookings");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No payment order found for this booking — call the order endpoint first"));

        if (!payment.getRazorpayOrderId().equals(request.getRazorpayOrderId())) {
            throw new IllegalArgumentException("Order id does not match this booking's payment");
        }

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValidSignature;
        try {
            isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);
        } catch (RazorpayException e) {
            isValidSignature = false;
        }

        if (!isValidSignature) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new IllegalArgumentException("Payment verification failed");
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return toResponse(payment);
    }

    // Called by BookingService when a PAID booking is cancelled early
// enough to qualify for a refund. Does nothing if this booking was
// never actually paid — cancelling an unpaid booking needs no refund.
    @Transactional
    public void refundForBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(null);

        if (payment == null || payment.getStatus() != PaymentStatus.PAID) {
            return;
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", payment.getAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact());

            client.payments.refund(payment.getRazorpayPaymentId(), refundRequest);

            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

        } catch (RazorpayException e) {
            // If Razorpay's refund call itself fails, we deliberately do
            // NOT silently mark it as refunded — that would be lying
            // about money that never actually moved. Surface it instead.
            throw new IllegalArgumentException("Refund failed: " + e.getMessage());
        }
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
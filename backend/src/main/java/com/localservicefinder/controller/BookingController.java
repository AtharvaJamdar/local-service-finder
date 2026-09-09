package com.localservicefinder.controller;

import com.localservicefinder.dto.booking.BookingRequest;
import com.localservicefinder.dto.booking.BookingResponse;
import com.localservicefinder.dto.booking.BookingStatusUpdateRequest;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // CUSTOMER ONLY — book a service. providerId and amount are never
    // taken from the request; BookingService derives both from the
    // service being booked.
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<BookingResponse>> create(
            @AuthenticationPrincipal UserPrincipal me,
            @Valid @RequestBody BookingRequest request) {

        BookingResponse response = bookingService.create(me.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created", response));
    }

    // CUSTOMER ONLY — "my bookings" page.
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal me) {

        return ResponseEntity.ok(
                ApiResponse.success("Your bookings", bookingService.getMyBookingsAsCustomer(me.getId())));
    }

    // PROVIDER ONLY — incoming/past bookings for this provider's services.
    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getProviderBookings(
            @AuthenticationPrincipal UserPrincipal me) {

        return ResponseEntity.ok(
                ApiResponse.success("Bookings for your services", bookingService.getMyBookingsAsProvider(me.getId())));
    }

    // Confirm / reject / complete / cancel — open to any logged-in user,
    // because the actual rule is enforced inside BookingService, not here.
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {

        BookingResponse response = bookingService.updateStatus(me.getId(), id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", response));
    }
}
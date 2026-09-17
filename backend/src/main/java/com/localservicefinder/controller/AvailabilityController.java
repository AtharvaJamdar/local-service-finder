package com.localservicefinder.controller;

import com.localservicefinder.dto.availability.AvailabilityDayResponse;
import com.localservicefinder.dto.availability.AvailabilityRequest;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // PROVIDER ONLY — the SlotEditor's own view of everything it has set,
    // including past dates and already-booked slots.
    @GetMapping("/me")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<List<AvailabilityDayResponse>>> getMyAvailability(
            @AuthenticationPrincipal UserPrincipal me) {

        return ResponseEntity.ok(
                ApiResponse.success("Your availability", availabilityService.getMyAvailability(me.getId())));
    }

    // PUBLIC — what the customer sees on the booking page: future,
    // unbooked slots for one provider.
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<AvailabilityDayResponse>>> getPublicAvailability(
            @PathVariable Long providerId) {

        return ResponseEntity.ok(
                ApiResponse.success("Provider availability", availabilityService.getPublicAvailability(providerId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<List<AvailabilityDayResponse>>> addSlot(
            @AuthenticationPrincipal UserPrincipal me,
            @Valid @RequestBody AvailabilityRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Slot added", availabilityService.addSlot(me.getId(), request)));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<List<AvailabilityDayResponse>>> removeSlot(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String slotTime) {

        return ResponseEntity.ok(
                ApiResponse.success("Slot removed", availabilityService.removeSlot(me.getId(), date, slotTime)));
    }
}
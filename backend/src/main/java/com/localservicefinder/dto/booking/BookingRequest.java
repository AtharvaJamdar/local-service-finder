package com.localservicefinder.dto.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequest {

    @NotNull(message = "Service is required")
    private Long serviceId;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledAt;

    @NotBlank(message = "Address is required")
    private String address;

    private Boolean isEmergency;
}
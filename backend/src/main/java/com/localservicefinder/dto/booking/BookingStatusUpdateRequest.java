package com.localservicefinder.dto.booking;

import com.localservicefinder.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;
}

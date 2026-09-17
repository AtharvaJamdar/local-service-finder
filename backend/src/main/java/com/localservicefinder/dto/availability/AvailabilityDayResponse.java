package com.localservicefinder.dto.availability;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

// Matches the shape the frontend already works with:
// { date: "2026-09-20", slots: ["9:00 AM", "11:00 AM"] }
// A slot marked isBooked=true is simply left out of "slots" for the
// public booking view - a booked slot isn't offered again.
@Getter
@Builder
@AllArgsConstructor
public class AvailabilityDayResponse {

    private LocalDate date;
    private List<String> slots;
}
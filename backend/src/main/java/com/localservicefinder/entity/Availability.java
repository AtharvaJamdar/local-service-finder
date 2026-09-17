package com.localservicefinder.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

// One row = one bookable slot for a provider on a given date.
// e.g. provider 5, date 2026-09-20, slotTime "9:00 AM".
@Entity
@Table(name = "availability_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Column(nullable = false)
    private LocalDate date;

    // Kept as free text ("9:00 AM") to match what the frontend already
    // collects in SlotEditor - not a LocalTime, so no parsing needed.
    @Column(name = "slot_time", nullable = false, length = 20)
    private String slotTime;

    @Column(name = "is_booked", nullable = false)
    @Builder.Default
    private Boolean isBooked = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
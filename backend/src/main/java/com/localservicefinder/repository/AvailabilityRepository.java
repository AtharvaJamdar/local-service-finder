package com.localservicefinder.repository;

import com.localservicefinder.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    // Used for the public booking page - only show today onward, ordered
    // so the frontend's day tabs / slot buttons render in a sane order.
    List<Availability> findByProviderIdAndDateGreaterThanEqualOrderByDateAscSlotTimeAsc(
            Long providerId, LocalDate fromDate);

    // Used for the provider's own SlotEditor - show everything, including
    // past dates, so they can see/manage what they've already added.
    List<Availability> findByProviderIdOrderByDateAscSlotTimeAsc(Long providerId);

    Optional<Availability> findByProviderIdAndDateAndSlotTime(
            Long providerId, LocalDate date, String slotTime);

    boolean existsByProviderIdAndDateAndSlotTime(
            Long providerId, LocalDate date, String slotTime);
}
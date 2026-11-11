package com.localservicefinder.repository;

import com.localservicefinder.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    // All payments for a set of bookings in one query
    List<Payment> findByBookingIdIn(Collection<Long> bookingIds);
}
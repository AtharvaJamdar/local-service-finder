package com.localservicefinder.repository;

import com.localservicefinder.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByBookingId(Long bookingId);

    List<Review> findByProviderId(Long providerId);

    // One row per provider: average rating and review count
    @Query("SELECT r.providerId AS providerId, AVG(r.rating) AS average, COUNT(r) AS reviewCount " +
            "FROM Review r WHERE r.providerId IN :providerIds GROUP BY r.providerId")
    List<ProviderRatingSummary> summarizeByProviderIds(@Param("providerIds") Collection<Long> providerIds);

    // Shape of each row returned by the query above
    interface ProviderRatingSummary {
        Long getProviderId();
        Double getAverage();
        Long getReviewCount();
    }
}
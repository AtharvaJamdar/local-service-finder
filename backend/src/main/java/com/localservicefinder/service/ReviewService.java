package com.localservicefinder.service;

import com.localservicefinder.dto.review.ReviewRequest;
import com.localservicefinder.dto.review.ReviewResponse;
import com.localservicefinder.entity.Booking;
import com.localservicefinder.entity.Review;
import com.localservicefinder.entity.User;
import com.localservicefinder.enums.BookingStatus;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.ReviewRepository;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse create(Long customerUserId, Long bookingId, ReviewRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUserId().equals(customerUserId)) {
            throw new AccessDeniedException("You can only review your own bookings");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("You can only review a completed booking");
        }

        if (reviewRepository.findByBookingId(bookingId).isPresent()) {
            throw new IllegalArgumentException("This booking has already been reviewed");
        }

        Review review = Review.builder()
                .bookingId(booking.getId())
                .userId(customerUserId)
                .providerId(booking.getProviderId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return toResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getByProvider(Long providerId) {
        return reviewRepository.findByProviderId(providerId)
                .stream().map(this::toResponse).toList();
    }

    private ReviewResponse toResponse(Review review) {
        User customer = userRepository.findById(review.getUserId()).orElse(null);

        return ReviewResponse.builder()
                .id(review.getId())
                .bookingId(review.getBookingId())
                .customerId(review.getUserId())
                .customerName(customer != null ? customer.getFullName() : null)
                .providerId(review.getProviderId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
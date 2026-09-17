package com.localservicefinder.service;

import com.localservicefinder.dto.booking.BookingRequest;
import com.localservicefinder.dto.booking.BookingResponse;
import com.localservicefinder.entity.Booking;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.entity.User;
import com.localservicefinder.enums.BookingStatus;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.ProviderProfileRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@org.springframework.stereotype.Service // fully-qualified to avoid clashing with the "Service" entity class
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    // Who is allowed to move a booking FROM one status TO another.
    // Anything not listed here is blocked, e.g. COMPLETED -> anything.
    private static final Set<Transition> ALLOWED_TRANSITIONS = Set.of(
            new Transition(BookingStatus.PENDING, BookingStatus.CONFIRMED, "PROVIDER"),
            new Transition(BookingStatus.PENDING, BookingStatus.REJECTED, "PROVIDER"),
            new Transition(BookingStatus.CONFIRMED, BookingStatus.ON_THE_WAY, "PROVIDER"),
            new Transition(BookingStatus.ON_THE_WAY, BookingStatus.ARRIVED, "PROVIDER"),
            new Transition(BookingStatus.ARRIVED, BookingStatus.COMPLETED, "PROVIDER"),
            new Transition(BookingStatus.PENDING, BookingStatus.CANCELLED, "CUSTOMER"),
            new Transition(BookingStatus.CONFIRMED, BookingStatus.CANCELLED, "CUSTOMER"),
            new Transition(BookingStatus.ON_THE_WAY, BookingStatus.CANCELLED, "CUSTOMER"),
            new Transition(BookingStatus.ARRIVED, BookingStatus.CANCELLED, "CUSTOMER")
    );

    @Transactional
    public BookingResponse create(Long customerUserId, BookingRequest request) {
        com.localservicefinder.entity.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with id: " + request.getServiceId()));

        if (!Boolean.TRUE.equals(service.getIsActive())) {
            throw new IllegalArgumentException("This service is no longer available");
        }

        Booking booking = Booking.builder()
                .userId(customerUserId)
                .providerId(service.getProviderId())
                .serviceId(service.getId())
                .status(BookingStatus.PENDING)
                .isEmergency(request.getIsEmergency() != null && request.getIsEmergency())
                .scheduledAt(request.getScheduledAt())
                .address(request.getAddress())
                .amount(service.getPrice())
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookingsAsCustomer(Long customerUserId) {
        return bookingRepository.findByUserId(customerUserId)
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getMyBookingsAsProvider(Long providerUserId) {
        ProviderProfile provider = providerProfileRepository.findByUserId(providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No provider profile found for this account"));

        return bookingRepository.findByProviderId(provider.getId())
                .stream().map(this::toResponse).toList();
    }

    public BookingResponse getById(Long loggedInUserId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Reuses the same ownership check as updateStatus — throws
        // AccessDeniedException if this user is neither the customer
        // nor the provider on this booking.
        resolveRoleForThisBooking(loggedInUserId, booking);

        return toResponse(booking);
    }

    @Transactional
    public BookingResponse updateStatus(Long loggedInUserId, Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        String actingAs = resolveRoleForThisBooking(loggedInUserId, booking);

        boolean allowed = ALLOWED_TRANSITIONS.stream().anyMatch(t ->
                t.from() == booking.getStatus()
                        && t.to() == newStatus
                        && t.allowedRole().equals(actingAs));

        if (!allowed) {
            throw new IllegalArgumentException(
                    "Cannot move booking from " + booking.getStatus() + " to " + newStatus + " as " + actingAs);
        }

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    private String resolveRoleForThisBooking(Long loggedInUserId, Booking booking) {
        if (booking.getUserId().equals(loggedInUserId)) {
            return "CUSTOMER";
        }

        boolean isThisProvider = providerProfileRepository.findByUserId(loggedInUserId)
                .map(p -> p.getId().equals(booking.getProviderId()))
                .orElse(false);

        if (isThisProvider) {
            return "PROVIDER";
        }

        throw new AccessDeniedException("You are not part of this booking");
    }

    private BookingResponse toResponse(Booking booking) {
        User customer = userRepository.findById(booking.getUserId()).orElse(null);
        ProviderProfile provider = providerProfileRepository.findById(booking.getProviderId()).orElse(null);
        com.localservicefinder.entity.Service service = serviceRepository.findById(booking.getServiceId()).orElse(null);

        return BookingResponse.builder()
                .id(booking.getId())
                .customerId(booking.getUserId())
                .customerName(customer != null ? customer.getFullName() : null)
                .providerId(booking.getProviderId())
                .providerBusinessName(provider != null ? provider.getBusinessName() : null)
                .serviceId(booking.getServiceId())
                .serviceTitle(service != null ? service.getTitle() : null)
                .status(booking.getStatus())
                .isEmergency(booking.getIsEmergency())
                .scheduledAt(booking.getScheduledAt())
                .address(booking.getAddress())
                .amount(booking.getAmount())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private record Transition(BookingStatus from, BookingStatus to, String allowedRole) {}
}
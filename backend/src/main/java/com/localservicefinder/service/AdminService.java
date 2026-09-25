package com.localservicefinder.service;

import com.localservicefinder.dto.admin.BookingAdminResponse;
import com.localservicefinder.dto.admin.ProviderAdminResponse;
import com.localservicefinder.dto.admin.UserAdminResponse;
import com.localservicefinder.entity.Booking;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.entity.User;
import com.localservicefinder.enums.ProviderStatus;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.ProviderProfileRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.localservicefinder.dto.admin.AdminStatsResponse;
import com.localservicefinder.enums.BookingStatus;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public List<ProviderAdminResponse> getPendingProviders() {
        return providerProfileRepository.findByStatus(ProviderStatus.PENDING)
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public ProviderAdminResponse approveProvider(Long providerId) {
        return updateStatus(providerId, ProviderStatus.APPROVED);
    }

    @Transactional
    public ProviderAdminResponse rejectProvider(Long providerId) {
        return updateStatus(providerId, ProviderStatus.SUSPENDED);
    }

    private ProviderAdminResponse updateStatus(Long providerId, ProviderStatus newStatus) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        profile.setStatus(newStatus);
        // isVerified only means "an admin has actually reviewed this one" —
        // it flips true on either approve or reject, never back to false.
        profile.setIsVerified(true);

        ProviderProfile saved = providerProfileRepository.save(profile);
        return toAdminResponse(saved);
    }

    private ProviderAdminResponse toAdminResponse(ProviderProfile profile) {
        User owner = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner user not found for provider " + profile.getId()));

        return ProviderAdminResponse.builder()
                .providerId(profile.getId())
                .userId(owner.getId())
                .fullName(owner.getFullName())
                .email(owner.getEmail())
                .businessName(profile.getBusinessName())
                .address(profile.getAddress())
                .status(profile.getStatus())
                .build();
    }

    public List<UserAdminResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserAdminResponse)
                .toList();
    }

    private UserAdminResponse toUserAdminResponse(User user) {
        return UserAdminResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }


    public List<BookingAdminResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toBookingAdminResponse)
                .toList();
    }

    private BookingAdminResponse toBookingAdminResponse(Booking booking) {
        String customerName = userRepository.findById(booking.getUserId())
                .map(User::getFullName)
                .orElse("Unknown");

        String providerBusinessName = providerProfileRepository.findById(booking.getProviderId())
                .map(ProviderProfile::getBusinessName)
                .orElse("Unknown");

        String serviceTitle = serviceRepository.findById(booking.getServiceId())
                .map(com.localservicefinder.entity.Service::getTitle)
                .orElse("Unknown");

        return BookingAdminResponse.builder()
                .id(booking.getId())
                .customerName(customerName)
                .providerBusinessName(providerBusinessName)
                .serviceTitle(serviceTitle)
                .status(booking.getStatus())
                .isEmergency(booking.getIsEmergency())
                .scheduledAt(booking.getScheduledAt())
                .address(booking.getAddress())
                .amount(booking.getAmount())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalProviders = providerProfileRepository.count();
        long pendingProviders = providerProfileRepository.findByStatus(ProviderStatus.PENDING).size();

        List<Booking> allBookings = bookingRepository.findAll();
        long totalBookings = allBookings.size();

        List<Booking> completed = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .toList();
        long completedBookings = completed.size();

        BigDecimal totalRevenue = completed.stream()
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalProviders(totalProviders)
                .pendingProviders(pendingProviders)
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .totalRevenue(totalRevenue)
                .build();
    }
}
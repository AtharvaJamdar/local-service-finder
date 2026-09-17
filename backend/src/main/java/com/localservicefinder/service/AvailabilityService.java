package com.localservicefinder.service;

import com.localservicefinder.dto.availability.AvailabilityDayResponse;
import com.localservicefinder.dto.availability.AvailabilityRequest;
import com.localservicefinder.entity.Availability;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.AvailabilityRepository;
import com.localservicefinder.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final ProviderProfileRepository providerProfileRepository;

    // Provider managing their own slots - sees everything, including past
    // dates and already-booked slots, so nothing looks like it vanished.
    public List<AvailabilityDayResponse> getMyAvailability(Long loggedInUserId) {
        Long providerId = resolveProviderId(loggedInUserId);
        List<Availability> slots =
                availabilityRepository.findByProviderIdOrderByDateAscSlotTimeAsc(providerId);
        return groupByDate(slots, false);
    }

    // Public booking page - only future dates, and never offer a slot
    // that's already booked.
    public List<AvailabilityDayResponse> getPublicAvailability(Long providerId) {
        List<Availability> slots =
                availabilityRepository.findByProviderIdAndDateGreaterThanEqualOrderByDateAscSlotTimeAsc(
                        providerId, LocalDate.now());
        return groupByDate(slots, true);
    }

    @Transactional
    public List<AvailabilityDayResponse> addSlot(Long loggedInUserId, AvailabilityRequest request) {
        Long providerId = resolveProviderId(loggedInUserId);

        // Idempotent: adding the same date+slot twice just no-ops instead
        // of erroring, since SlotEditor doesn't need to handle that case.
        boolean alreadyExists = availabilityRepository.existsByProviderIdAndDateAndSlotTime(
                providerId, request.getDate(), request.getSlotTime());

        if (!alreadyExists) {
            Availability slot = Availability.builder()
                    .providerId(providerId)
                    .date(request.getDate())
                    .slotTime(request.getSlotTime())
                    .build();
            availabilityRepository.save(slot);
        }

        return getMyAvailability(loggedInUserId);
    }

    @Transactional
    public List<AvailabilityDayResponse> removeSlot(Long loggedInUserId, LocalDate date, String slotTime) {
        Long providerId = resolveProviderId(loggedInUserId);

        Availability slot = availabilityRepository.findByProviderIdAndDateAndSlotTime(providerId, date, slotTime)
                .orElseThrow(() -> new ResourceNotFoundException("No such availability slot"));

        availabilityRepository.delete(slot);
        return getMyAvailability(loggedInUserId);
    }

    private Long resolveProviderId(Long loggedInUserId) {
        ProviderProfile profile = providerProfileRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No provider profile found for this account"));
        return profile.getId();
    }

    private List<AvailabilityDayResponse> groupByDate(List<Availability> slots, boolean excludeBooked) {
        Map<LocalDate, List<String>> grouped = slots.stream()
                .filter(a -> !excludeBooked || !Boolean.TRUE.equals(a.getIsBooked()))
                .collect(Collectors.groupingBy(
                        Availability::getDate,
                        LinkedHashMap::new,
                        Collectors.mapping(Availability::getSlotTime, Collectors.toList())));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> AvailabilityDayResponse.builder()
                        .date(e.getKey())
                        .slots(e.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}
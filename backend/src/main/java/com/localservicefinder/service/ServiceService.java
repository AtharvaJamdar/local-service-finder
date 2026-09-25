package com.localservicefinder.service;

import com.localservicefinder.dto.service.ServiceRequest;
import com.localservicefinder.dto.service.ServiceResponse;
import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.entity.ServiceCategory;
import com.localservicefinder.entity.User;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ProviderProfileRepository;
import com.localservicefinder.repository.ServiceCategoryRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.localservicefinder.enums.ProviderStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final com.localservicefinder.repository.ReviewRepository reviewRepository;



    public ServiceResponse getById(Long id) {
        var service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        boolean providerApproved = providerProfileRepository.findById(service.getProviderId())
                .map(p -> p.getStatus() == ProviderStatus.APPROVED)
                .orElse(false);

        if (!Boolean.TRUE.equals(service.getIsActive()) || !providerApproved) {
            throw new ResourceNotFoundException("Service not found with id: " + id);
        }
        return toResponse(service);
    }

    public List<ServiceResponse> getAllActive() {
        return serviceRepository.findAllVisible()
                .stream().map(this::toResponse).toList();
    }

    public List<ServiceResponse> getByCategory(Long categoryId) {
        return serviceRepository.findVisibleByCategoryId(categoryId)
                .stream().map(this::toResponse).toList();
    }

    public List<ServiceResponse> getMyServices(Long loggedInUserId) {
        ProviderProfile provider = getProviderProfileOrThrow(loggedInUserId);
        return serviceRepository.findByProviderId(provider.getId())
                .stream().map(this::toResponse).toList();
    }

    public ServiceResponse create(Long loggedInUserId, ServiceRequest request) {
        ProviderProfile provider = getProviderProfileOrThrow(loggedInUserId);
        ServiceCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        var service = com.localservicefinder.entity.Service.builder()
                .providerId(provider.getId())
                .categoryId(category.getId())
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .isActive(true)
                .build();

        return toResponse(serviceRepository.save(service));
    }

    public ServiceResponse update(Long loggedInUserId, Long serviceId, ServiceRequest request) {
        var service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        assertOwnsService(loggedInUserId, service);

        ServiceCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setCategoryId(category.getId());

        return toResponse(serviceRepository.save(service));
    }

    public void delete(Long loggedInUserId, Long serviceId) {
        var service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        assertOwnsService(loggedInUserId, service);
        service.setIsActive(false);
        serviceRepository.save(service);
    }

    private ProviderProfile getProviderProfileOrThrow(Long loggedInUserId) {
        return providerProfileRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No provider profile found for this account"));
    }

    private void assertOwnsService(Long loggedInUserId, com.localservicefinder.entity.Service service) {
        ProviderProfile provider = getProviderProfileOrThrow(loggedInUserId);
        if (!service.getProviderId().equals(provider.getId())) {
            throw new AccessDeniedException("You do not own this service");
        }
    }

    public List<ServiceResponse> search(String keyword, Long categoryId) {
        return serviceRepository.search(keyword, categoryId)
                .stream().map(this::toResponse).toList();
    }

    private ServiceResponse toResponse(com.localservicefinder.entity.Service service) {
        ProviderProfile provider = providerProfileRepository.findById(service.getProviderId()).orElse(null);

        String providerName = null;
        String providerPhone = null;
        Double providerLatitude = null;
        Double providerLongitude = null;
        if (provider != null) {
            providerName = userRepository.findById(provider.getUserId()).map(User::getFullName).orElse(null);
            providerPhone = userRepository.findById(provider.getUserId()).map(User::getPhone).orElse(null);
            providerLatitude = provider.getLatitude() != null ? provider.getLatitude().doubleValue() : null;
            providerLongitude = provider.getLongitude() != null ? provider.getLongitude().doubleValue() : null;
        }

        // Rating is computed on the fly from Review rows rather than stored -
        // review volume is small enough here that a stored/cached average
        // isn't worth the extra bookkeeping yet.
        List<com.localservicefinder.entity.Review> reviews =
                reviewRepository.findByProviderId(service.getProviderId());
        Double ratingAverage = reviews.isEmpty()
                ? null
                : reviews.stream().mapToInt(com.localservicefinder.entity.Review::getRating).average().orElse(0);

        String categoryName = categoryRepository.findById(service.getCategoryId())
                .map(ServiceCategory::getName).orElse(null);

        return ServiceResponse.builder()
                .id(service.getId())
                .title(service.getTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .isActive(service.getIsActive())
                .providerId(service.getProviderId())
                .providerName(providerName)
                .providerPhone(providerPhone)
                .providerLatitude(providerLatitude)
                .providerLongitude(providerLongitude)
                .providerRatingAverage(ratingAverage)
                .providerReviewCount(reviews.size())
                .categoryId(service.getCategoryId())
                .categoryName(categoryName)
                .createdAt(service.getCreatedAt())
                .build();
    }
}
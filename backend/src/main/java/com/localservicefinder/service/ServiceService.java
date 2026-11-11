package com.localservicefinder.service;

import com.localservicefinder.repository.ReviewRepository.ProviderRatingSummary;

import java.util.Comparator;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

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
import com.localservicefinder.util.DistanceUtil;
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
        return toResponses(serviceRepository.findAllVisible());
    }

    public List<ServiceResponse> getByCategory(Long categoryId) {
        return toResponses(serviceRepository.findVisibleByCategoryId(categoryId));
    }

    public List<ServiceResponse> getMyServices(Long loggedInUserId) {
        ProviderProfile provider = getProviderProfileOrThrow(loggedInUserId);
        return toResponses(serviceRepository.findByProviderId(provider.getId()));
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
        return toResponses(serviceRepository.search(keyword, categoryId));
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

    private List<ServiceResponse> toResponses(List<com.localservicefinder.entity.Service> services) {
        if (services.isEmpty()) {
            return List.of();
        }

        Set<Long> providerIds = services.stream()
                .map(com.localservicefinder.entity.Service::getProviderId)
                .collect(Collectors.toSet());

        Map<Long, ProviderProfile> providers = providerProfileRepository.findAllById(providerIds).stream()
                .collect(Collectors.toMap(ProviderProfile::getId, Function.identity()));

        Set<Long> userIds = providers.values().stream()
                .map(ProviderProfile::getUserId)
                .collect(Collectors.toSet());

        Map<Long, User> users = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        Map<Long, String> categoryNames = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(ServiceCategory::getId, ServiceCategory::getName));

        Map<Long, ProviderRatingSummary> ratings = reviewRepository.summarizeByProviderIds(providerIds).stream()
                .collect(Collectors.toMap(ProviderRatingSummary::getProviderId, Function.identity()));

        return services.stream().map(service -> {
            ProviderProfile provider = providers.get(service.getProviderId());
            User user = provider != null ? users.get(provider.getUserId()) : null;
            ProviderRatingSummary rating = ratings.get(service.getProviderId());

            return ServiceResponse.builder()
                    .id(service.getId())
                    .title(service.getTitle())
                    .description(service.getDescription())
                    .price(service.getPrice())
                    .isActive(service.getIsActive())
                    .providerId(service.getProviderId())
                    .providerName(user != null ? user.getFullName() : null)
                    .providerPhone(user != null ? user.getPhone() : null)
                    .providerLatitude(provider != null && provider.getLatitude() != null
                            ? provider.getLatitude().doubleValue() : null)
                    .providerLongitude(provider != null && provider.getLongitude() != null
                            ? provider.getLongitude().doubleValue() : null)
                    .providerRatingAverage(rating != null ? rating.getAverage() : null)
                    .providerReviewCount(rating != null ? rating.getReviewCount().intValue() : 0)
                    .categoryId(service.getCategoryId())
                    .categoryName(categoryNames.get(service.getCategoryId()))
                    .createdAt(service.getCreatedAt())
                    .build();
        }).toList();
    }

    private static final double WEIGHT_DISTANCE = 0.4;
    private static final double WEIGHT_RATING = 0.4;
    private static final double WEIGHT_FEE = 0.2;
    private static final double MAX_DISTANCE_KM = 20.0;

    public List<ServiceResponse> recommend(double userLat, double userLng, Long categoryId) {
        List<com.localservicefinder.entity.Service> services = categoryId == null
                ? serviceRepository.findAllVisible()
                : serviceRepository.findVisibleByCategoryId(categoryId);

        List<ServiceResponse> responses = toResponses(services);
        if (responses.isEmpty()) {
            return responses;
        }

        double minPrice = responses.stream()
                .filter(r -> r.getPrice() != null && r.getPrice().doubleValue() > 0)
                .mapToDouble(r -> r.getPrice().doubleValue())
                .min().orElse(0);

        Set<Long> seenProviders = new java.util.HashSet<>();

        return responses.stream().map(r -> {
            Double distanceKm = null;
            double distanceScore = 0;
            if (r.getProviderLatitude() != null && r.getProviderLongitude() != null) {
                double km = DistanceUtil.calculateDistanceKm(
                        userLat, userLng, r.getProviderLatitude(), r.getProviderLongitude());
                distanceKm = Math.round(km * 10) / 10.0;
                distanceScore = Math.max(0, 1 - km / MAX_DISTANCE_KM);
            }

            double ratingScore = r.getProviderRatingAverage() != null
                    ? r.getProviderRatingAverage() / 5.0
                    : 0.5;

            double price = r.getPrice() != null ? r.getPrice().doubleValue() : 0;
            double feeScore = (price > 0 && minPrice > 0) ? minPrice / price : 0;

            double score = 100 * (WEIGHT_DISTANCE * distanceScore
                    + WEIGHT_RATING * ratingScore
                    + WEIGHT_FEE * feeScore);

            return r.toBuilder()
                    .distanceKm(distanceKm)
                    .recommendationScore(Math.round(score * 10) / 10.0)
                    .build();
                }).sorted(Comparator.comparing(ServiceResponse::getRecommendationScore).reversed())
                .filter(r -> seenProviders.add(r.getProviderId()))
                .toList();
    }
}
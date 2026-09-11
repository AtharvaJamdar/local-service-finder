package com.localservicefinder.repository;

import com.localservicefinder.entity.ProviderProfile;
import com.localservicefinder.enums.ProviderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {

    Optional<ProviderProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<ProviderProfile> findByStatus(ProviderStatus status);
}
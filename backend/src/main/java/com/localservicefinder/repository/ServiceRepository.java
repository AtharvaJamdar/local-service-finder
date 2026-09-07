package com.localservicefinder.repository;

import com.localservicefinder.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    // Browsing: only ever show services that are still active.
    List<Service> findByIsActiveTrue();

    List<Service> findByCategoryIdAndIsActiveTrue(Long categoryId);

    // A provider managing their own listings needs to see inactive ones too.
    List<Service> findByProviderId(Long providerId);
}
package com.localservicefinder.repository;

import com.localservicefinder.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    // Browsing: only ever show services that are still active.
    List<Service> findByIsActiveTrue();

    List<Service> findByCategoryIdAndIsActiveTrue(Long categoryId);

    // A provider managing their own listings needs to see inactive ones too.
    List<Service> findByProviderId(Long providerId);

    @Query("SELECT s FROM Service s WHERE s.isActive = true " +
            "AND s.providerId IN (SELECT p.id FROM ProviderProfile p " +
            "WHERE p.status = com.localservicefinder.enums.ProviderStatus.APPROVED) " +
            "AND (:keyword IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:categoryId IS NULL OR s.categoryId = :categoryId)")
    List<Service> search(@Param("keyword") String keyword, @Param("categoryId") Long categoryId);

    // Browsing: only active services whose provider an admin has APPROVED.
    @Query("SELECT s FROM Service s WHERE s.isActive = true " +
            "AND s.providerId IN (SELECT p.id FROM ProviderProfile p " +
            "WHERE p.status = com.localservicefinder.enums.ProviderStatus.APPROVED)")
    List<Service> findAllVisible();

    @Query("SELECT s FROM Service s WHERE s.isActive = true " +
            "AND s.categoryId = :categoryId " +
            "AND s.providerId IN (SELECT p.id FROM ProviderProfile p " +
            "WHERE p.status = com.localservicefinder.enums.ProviderStatus.APPROVED)")
    List<Service> findVisibleByCategoryId(@Param("categoryId") Long categoryId);
}
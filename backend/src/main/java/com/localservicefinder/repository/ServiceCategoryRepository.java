package com.localservicefinder.repository;

import com.localservicefinder.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository
        extends JpaRepository<ServiceCategory, Long> {
}
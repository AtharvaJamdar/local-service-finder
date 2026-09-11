// controller/CategoryController.java
package com.localservicefinder.controller;

import com.localservicefinder.dto.CategoryResponse;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ServiceCategoryRepository categoryRepository;

    // PUBLIC — needed to populate dropdowns for both "create service" and search filters.
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll() {
        List<CategoryResponse> categories = categoryRepository.findAll().stream()
                .map(c -> CategoryResponse.builder().id(c.getId()).name(c.getName()).build())
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Categories fetched", categories));
    }
}
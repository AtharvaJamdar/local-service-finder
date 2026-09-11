package com.localservicefinder.controller;

import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.dto.service.ServiceRequest;
import com.localservicefinder.dto.service.ServiceResponse;
import com.localservicefinder.security.UserPrincipal;
import com.localservicefinder.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    // PUBLIC — anyone can browse services, logged in or not.
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Services fetched", serviceService.getAllActive()));
    }

    // PUBLIC — browse services filtered by category.
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success("Services fetched", serviceService.getByCategory(categoryId)));
    }

    // PUBLIC — view one specific service's full details.
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Service fetched", serviceService.getById(id)));
    }

    // PROVIDER ONLY — "my listings" page, includes inactive ones too.
    @GetMapping("/my")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getMyServices(
            @AuthenticationPrincipal UserPrincipal me) {
        return ResponseEntity.ok(ApiResponse.success("Your services", serviceService.getMyServices(me.getId())));
    }

    // PROVIDER ONLY — create a new listing under their own account.
    // providerId always comes from the logged-in user, never the request body.
    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<ServiceResponse>> create(
            @AuthenticationPrincipal UserPrincipal me,
            @Valid @RequestBody ServiceRequest request) {

        ServiceResponse response = serviceService.create(me.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service created", response));
    }

    // PROVIDER ONLY — edit one of their own services (ownership checked in the service layer).
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<ServiceResponse>> update(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request) {

        return ResponseEntity.ok(ApiResponse.success("Service updated", serviceService.update(me.getId(), id, request)));
    }

    // PROVIDER ONLY — soft-deletes a service (isActive = false), so old bookings/reviews stay valid.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable Long id) {

        serviceService.delete(me.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted", null));
    }

    // PUBLIC — search by keyword (matches title or description) and/or category.
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {

        return ResponseEntity.ok(ApiResponse.success("Search results", serviceService.search(keyword, categoryId)));
    }
}
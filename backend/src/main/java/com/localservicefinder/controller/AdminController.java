package com.localservicefinder.controller;

import com.localservicefinder.dto.admin.AdminStatsResponse;
import com.localservicefinder.dto.admin.BookingAdminResponse;
import com.localservicefinder.dto.admin.ProviderAdminResponse;
import com.localservicefinder.dto.admin.UserAdminResponse;
import com.localservicefinder.dto.response.ApiResponse;
import com.localservicefinder.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // SecurityConfig already locks all of /admin/** to ROLE_ADMIN, so this
    // @PreAuthorize is belt-and-braces — kept for consistency with the
    // rest of the controllers, which state their role requirement inline.
    @GetMapping("/providers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProviderAdminResponse>>> getPendingProviders() {
        return ResponseEntity.ok(
                ApiResponse.success("Pending providers", adminService.getPendingProviders()));
    }

    @PatchMapping("/providers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProviderAdminResponse>> approveProvider(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Provider approved", adminService.approveProvider(id)));
    }

    @PatchMapping("/providers/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProviderAdminResponse>> rejectProvider(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Provider rejected", adminService.rejectProvider(id)));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserAdminResponse>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success("All users", adminService.getAllUsers()));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingAdminResponse>>> getAllBookings() {
        return ResponseEntity.ok(
                ApiResponse.success("All bookings", adminService.getAllBookings()));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(
                ApiResponse.success("Admin stats", adminService.getStats()));
    }
}
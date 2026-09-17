package com.localservicefinder.entity;

import com.localservicefinder.enums.ProviderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Extra, provider-specific info about a User whose role is PROVIDER.
// This is NOT a separate login identity — a provider logs in through
// the same /auth/login as everyone else; this table just holds the
// extra business fields a CUSTOMER doesn't need.
@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "business_name", nullable = false, length = 150)
    private String businessName;

    @Column(length = 255)
    private String address;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProviderStatus status = ProviderStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
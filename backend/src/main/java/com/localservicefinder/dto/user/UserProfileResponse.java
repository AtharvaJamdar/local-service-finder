// dto/UserProfileResponse.java
package com.localservicefinder.dto.user;

import com.localservicefinder.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;
    private Role role;
    private LocalDateTime createdAt;
}
package com.localservicefinder.dto.login;

import com.localservicefinder.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    // The frontend stores this and sends it back as "Authorization: Bearer <token>".
    private String token;

    private Long userId;
    private String name;
    private String email;
    private Role role;
}
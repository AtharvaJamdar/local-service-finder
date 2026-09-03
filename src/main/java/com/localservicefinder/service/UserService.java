package com.localservicefinder.service;

import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// Auth (register/login) now lives in AuthService.
// This class is reserved for user-profile logic (GET/PUT own profile) — Phase 5.
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
}
package com.localservicefinder.controller;

import com.localservicefinder.dto.UserRegistrationRequest;
import com.localservicefinder.dto.UserResponse;
import com.localservicefinder.entity.User;
import com.localservicefinder.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse registerUser(
            @Valid @RequestBody UserRegistrationRequest request) {

        return userService.registerUser(request);
    }
}
package com.localservicefinder.mapper;

import com.localservicefinder.dto.UserResponse;
import com.localservicefinder.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * Converts a User entity into a UserResponse DTO.
     * Sensitive fields such as the password are not included.
     */
    public UserResponse toResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setActive(user.getActive());

        return response;
    }
}
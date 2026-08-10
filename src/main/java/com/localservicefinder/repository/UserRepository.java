package com.localservicefinder.repository;

import com.localservicefinder.entity.User;
import com.localservicefinder.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    /**
     * Finds a user by phone number.
     */
    Optional<User> findByPhone(String phone);
    List<User> findByRole(Role role);

    /**
     * Checks whether a user already exists with the given email.
     */
    boolean existsByEmail(String email);
}

package com.localservicefinder.security;

import com.localservicefinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        // "username" here is really the email — Spring Security's
        // interface just calls it username regardless of what you use.
        return userRepository.findByEmail(email)
                .map(UserPrincipal::new)   // wrap the entity so Spring Security can use it
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));
    }
}
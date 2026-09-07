package com.localservicefinder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expiryMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiry-ms}") long expiryMs) {

        // Convert the raw secret string into a real signing key, once.
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiryMs = expiryMs;
    }

    // Builds a signed token containing the user's id and role.
    public String generateToken(Long userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);

        return Jwts.builder()
                .subject(String.valueOf(userId))   // who this token belongs to
                .claim("role", role)               // what they're allowed to do
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)                // seals it with our secret
                .compact();
    }

    // True if the signature is valid and the token hasn't expired.
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            // Bad signature, tampered token, or expired — all treated as invalid.
            return false;
        }
    }

    // Extracts the user id we stored as the "subject".
    public Long getUserId(String token) {
        return Long.valueOf(parseClaims(token).getSubject());
    }

    // Extracts the role we stored as a custom claim.
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // Verifies the signature and decodes the token's payload.
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
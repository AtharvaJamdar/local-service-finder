package com.localservicefinder;

public class AdminHashGenerator {
    public static void main(String[] args) {
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        System.out.println(encoder.encode("12345"));
    }
}
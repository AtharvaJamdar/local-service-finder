package com.localservicefinder.config;

import com.localservicefinder.entity.Service;
import com.localservicefinder.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ServiceRepository serviceRepository;

    @Override
    public void run(String... args) {
        Service plumbing = Service.builder()
                .name("Plumbing")
                .description("Plumbing repair and maintenance")
                .price(500.0)
                .active(true)
                .build();

        Service electrical = Service.builder()
                .name("Electrical")
                .description("Electrical repair and maintenance")
                .price(600.0)
                .active(true)
                .build();

        Service cleaning = Service.builder()
                .name("Cleaning")
                .description("Home and office cleaning services")
                .price(800.0)
                .active(true)
                .build();

        if (serviceRepository.findByName("Plumbing").isEmpty()) {
            serviceRepository.save(plumbing);
        }
        if (serviceRepository.findByName("Electrical").isEmpty()) {
            serviceRepository.save(electrical);
        }
        if (serviceRepository.findByName("Cleaning").isEmpty()) {
            serviceRepository.save(cleaning);
        }

    }
}
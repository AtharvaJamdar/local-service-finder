// dto/provider/ProviderProfileUpdateRequest.java
package com.localservicefinder.dto.provider;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProviderProfileUpdateRequest {

    @Size(max = 150)
    private String businessName;

    @Size(max = 255)
    private String address;

    private Double latitude;
    private Double longitude;
}
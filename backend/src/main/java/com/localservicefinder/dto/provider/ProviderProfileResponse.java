// dto/provider/ProviderProfileResponse.java
package com.localservicefinder.dto.provider;

import com.localservicefinder.enums.ProviderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfileResponse {

    private Long id;
    private String businessName;
    private String address;
    private Double latitude;
    private Double longitude;
    private Boolean isVerified;
    private ProviderStatus status;
}
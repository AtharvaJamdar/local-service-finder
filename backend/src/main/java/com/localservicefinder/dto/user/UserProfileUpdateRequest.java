// dto/UserProfileUpdateRequest.java
package com.localservicefinder.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateRequest {

    @Size(max = 100)
    private String fullName;

    @Size(max = 15)
    private String phone;

    @Size(max = 255)
    private String address;

    private Double latitude;
    private Double longitude;
}
// dto/CategoryResponse.java
package com.localservicefinder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
}
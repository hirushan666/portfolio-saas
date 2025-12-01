package com.portfoliosaas.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class CreatePortfolioRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Title is required")
    private String title;

    private String bio;

    private String theme = "modern";

    private Map<String, Object> data;
}
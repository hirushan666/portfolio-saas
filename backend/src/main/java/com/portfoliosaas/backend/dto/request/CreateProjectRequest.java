package com.portfoliosaas.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateProjectRequest {

    @NotBlank(message = "Portfolio ID is required")
    private String portfolioId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private List<String> techStack;

    private String githubUrl;

    private String liveUrl;

    private String image;

    private Boolean featured = false;

    private Integer displayOrder = 0;

    private Integer stars;

    private Integer forks;

    private String language;
}
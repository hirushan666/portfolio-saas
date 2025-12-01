package com.portfoliosaas.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private String id;
    private String portfolioId;
    private String title;
    private String description;
    private List<String> techStack;
    private String githubUrl;
    private String liveUrl;
    private String image;
    private Boolean featured;
    private Integer displayOrder;
    private Integer stars;
    private Integer forks;
    private String language;
    private LocalDateTime createdAt;
}
package com.portfoliosaas.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProjectRequest {
    private String title;
    private String description;
    private List<String> techStack;
    private String githubUrl;
    private String liveUrl;
    private String image;
    private Boolean featured;
    private Integer displayOrder;
}
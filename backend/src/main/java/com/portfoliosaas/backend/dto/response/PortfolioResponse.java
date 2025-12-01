package com.portfoliosaas.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioResponse {
    private String id;
    private String userId;
    private Integer portfolioNumber;
    private String title;
    private String bio;
    private String theme;
    private Boolean published;
    private Map<String, Object> data;
    private Integer viewCount;
    private List<ProjectResponse> projects;
    private UserBasicInfo user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBasicInfo {
        private String id;
        private String name;
        private String githubUsername;
        private String image;
    }
}
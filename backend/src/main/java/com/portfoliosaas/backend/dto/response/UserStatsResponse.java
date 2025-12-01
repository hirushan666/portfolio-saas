package com.portfoliosaas.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private UserBasicInfo user;
    private Stats stats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBasicInfo {
        private String id;
        private String name;
        private String email;
        private String githubUsername;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stats {
        private Long portfolios;
        private Long publishedPortfolios;
        private Long projects;
        private Long totalViews;
    }
}
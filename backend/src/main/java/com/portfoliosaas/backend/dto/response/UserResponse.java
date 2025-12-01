package com.portfoliosaas.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String image;
    private String githubUsername;
    private LocalDateTime createdAt;
    private Integer portfolioCount;
}
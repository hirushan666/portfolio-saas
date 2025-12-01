package com.portfoliosaas.backend.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class UpdatePortfolioRequest {
    private String title;
    private String bio;
    private String theme;
    private Map<String, Object> data;
}
package com.portfoliosaas.backend.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String image;
}
package com.portfoliosaas.backend.controller;

import com.portfoliosaas.backend.service.GithubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GithubController {

    private final GithubService githubService;

    @GetMapping("/repos")
    public ResponseEntity<List<Map<String, Object>>> getUserRepos(
            @RequestHeader("Authorization") String authToken) {
        List<Map<String, Object>> repos = githubService.getUserRepositories(authToken);
        return ResponseEntity.ok(repos);
    }
}
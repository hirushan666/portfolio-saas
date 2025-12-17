package com.portfoliosaas.backend.controller;

import com.portfoliosaas.backend.dto.request.CreatePortfolioRequest;
import com.portfoliosaas.backend.dto.request.UpdatePortfolioRequest;
import com.portfoliosaas.backend.dto.response.PortfolioResponse;
import com.portfoliosaas.backend.service.PortfolioService;
import com.portfoliosaas.backend.service.GithubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final GithubService githubService;

    @PostMapping
    public ResponseEntity<PortfolioResponse> createPortfolio(
            @Valid @RequestBody CreatePortfolioRequest request) {
        PortfolioResponse response = portfolioService.createPortfolio(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PortfolioResponse>> getAllPortfolios(
            @RequestParam(required = false) String userId) {
        List<PortfolioResponse> portfolios = (userId != null)
                ? portfolioService.getAllPortfoliosByUserId(userId)
                : portfolioService.getAllPortfolios();
        return ResponseEntity.ok(portfolios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> getPortfolioById(@PathVariable String id) {
        PortfolioResponse portfolio = portfolioService.getPortfolioById(id);
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/user/{username}/{number}")
    public ResponseEntity<PortfolioResponse> getPortfolioByUsernameAndNumber(
            @PathVariable String username,
            @PathVariable Integer number) {
        PortfolioResponse portfolio = portfolioService.getPortfolioByUsernameAndNumber(username, number);
        return ResponseEntity.ok(portfolio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @PathVariable String id,
            @Valid @RequestBody UpdatePortfolioRequest request) {
        PortfolioResponse portfolio = portfolioService.updatePortfolio(id, request);
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<PortfolioResponse> publishPortfolio(@PathVariable String id) {
        PortfolioResponse portfolio = portfolioService.publishPortfolio(id);
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<PortfolioResponse> unpublishPortfolio(@PathVariable String id) {
        PortfolioResponse portfolio = portfolioService.unpublishPortfolio(id);
        return ResponseEntity.ok(portfolio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable String id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ NEW: Reload projects from GitHub
    @PostMapping("/{id}/reload-github")
    public ResponseEntity<Map<String, Object>> reloadProjectsFromGithub(
            @PathVariable String id,
            @RequestHeader("Authorization") String authToken) {
        Map<String, Object> result = githubService.reloadPortfolioProjects(id, authToken);
        return ResponseEntity.ok(result);
    }
}
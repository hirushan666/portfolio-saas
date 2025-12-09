package com.portfoliosaas.backend.service;

import com.portfoliosaas.backend.exception.ResourceNotFoundException;
import com.portfoliosaas.backend.model.Portfolio;
import com.portfoliosaas.backend.model.Project;
import com.portfoliosaas.backend.model.User;
import com.portfoliosaas.backend.repository.PortfolioRepository;
import com.portfoliosaas.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GithubService {

    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GITHUB_API_URL = "https://api.github.com";

    /**
     * Fetch user's GitHub repositories
     */
    public List<Map<String, Object>> getUserRepositories(String authToken) {
        String url = GITHUB_API_URL + "/user/repos?sort=updated&per_page=100";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authToken); // Should be "Bearer token" or "token xxx"
        headers.set("Accept", "application/vnd.github.v3+json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    List.class
            );

            List<Map<String, Object>> repos = response.getBody();

            // Transform to simpler format
            List<Map<String, Object>> simplifiedRepos = new ArrayList<>();
            if (repos != null) {
                for (Object repo : repos) {
                    Map<String, Object> repoMap = (Map<String, Object>) repo;

                    Map<String, Object> simplified = new HashMap<>();
                    simplified.put("id", repoMap.get("id"));
                    simplified.put("name", repoMap.get("name"));
                    simplified.put("description", repoMap.get("description"));
                    simplified.put("html_url", repoMap.get("html_url"));
                    simplified.put("homepage", repoMap.get("homepage"));
                    simplified.put("stargazers_count", repoMap.get("stargazers_count"));
                    simplified.put("forks_count", repoMap.get("forks_count"));
                    simplified.put("language", repoMap.get("language"));
                    simplified.put("topics", repoMap.get("topics"));

                    simplifiedRepos.add(simplified);
                }
            }

            return simplifiedRepos;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch GitHub repositories: " + e.getMessage());
        }
    }

    /**
     * Reload projects from GitHub - deletes existing GitHub-sourced projects and fetches fresh
     */
    @Transactional
    public Map<String, Object> reloadPortfolioProjects(String portfolioId, String authToken) {
        // Verify portfolio exists
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        User user = portfolio.getUser();
        if (user == null || user.getGithubUsername() == null) {
            throw new RuntimeException("User does not have GitHub connected");
        }

        // Fetch fresh repos from GitHub
        List<Map<String, Object>> githubRepos = getUserRepositories(authToken);

        // Get existing projects from this portfolio
        List<Project> existingProjects = projectRepository.findByPortfolioIdOrderByDisplayOrderAsc(portfolioId);

        // Find and delete projects that came from GitHub (have stars/forks data)
        List<String> deletedProjectIds = new ArrayList<>();
        for (Project project : existingProjects) {
            if (project.getStars() != null || project.getForks() != null) {
                deletedProjectIds.add(project.getId());
                projectRepository.delete(project);
            }
        }

        // Create new projects from GitHub repos
        List<Map<String, Object>> newProjects = new ArrayList<>();
        int order = existingProjects.size(); // Start ordering after existing manual projects

        for (Map<String, Object> repo : githubRepos) {
            Project project = new Project();
            project.setId(UUID.randomUUID().toString());
            project.setPortfolioId(portfolioId);
            project.setTitle((String) repo.get("name"));
            project.setDescription((String) repo.get("description"));

            // Extract tech stack from topics
            List<String> topics = (List<String>) repo.get("topics");
            if (topics != null && !topics.isEmpty()) {
                project.setTechStack(topics);  // <-- correct
            }


            project.setGithubUrl((String) repo.get("html_url"));
            project.setLiveUrl((String) repo.get("homepage"));
            project.setStars((Integer) repo.get("stargazers_count"));
            project.setForks((Integer) repo.get("forks_count"));
            project.setLanguage((String) repo.get("language"));
            project.setFeatured(false);
            project.setDisplayOrder(order++);

            Project savedProject = projectRepository.save(project);

            Map<String, Object> projectData = new HashMap<>();
            projectData.put("id", savedProject.getId());
            projectData.put("title", savedProject.getTitle());
            projectData.put("githubUrl", savedProject.getGithubUrl());
            newProjects.add(projectData);
        }

        // Return summary
        Map<String, Object> result = new HashMap<>();
        result.put("portfolioId", portfolioId);
        result.put("deletedProjects", deletedProjectIds.size());
        result.put("addedProjects", newProjects.size());
        result.put("newProjects", newProjects);

        return result;
    }
}
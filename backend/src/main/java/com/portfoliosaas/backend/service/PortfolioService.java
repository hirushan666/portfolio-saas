package com.portfoliosaas.backend.service;

import com.portfoliosaas.backend.dto.request.CreatePortfolioRequest;
import com.portfoliosaas.backend.dto.request.UpdatePortfolioRequest;
import com.portfoliosaas.backend.dto.response.PortfolioResponse;
import com.portfoliosaas.backend.dto.response.ProjectResponse;
import com.portfoliosaas.backend.exception.ResourceNotFoundException;
import com.portfoliosaas.backend.model.Portfolio;
import com.portfoliosaas.backend.model.Project;
import com.portfoliosaas.backend.model.User;
import com.portfoliosaas.backend.repository.PortfolioRepository;
import com.portfoliosaas.backend.repository.ProjectRepository;
import com.portfoliosaas.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public PortfolioResponse createPortfolio(CreatePortfolioRequest request) {
        // Verify user exists
        if (!userRepository.existsById(request.getUserId())) {
            throw new ResourceNotFoundException("User not found");
        }

        // Get next portfolio number for this user
        Portfolio lastPortfolio = portfolioRepository.findLastPortfolioByUserId(request.getUserId())
                .orElse(null);
        int nextNumber = (lastPortfolio != null) ? lastPortfolio.getPortfolioNumber() + 1 : 1;

        Portfolio portfolio = new Portfolio();
        portfolio.setId(UUID.randomUUID().toString());
        portfolio.setUserId(request.getUserId());
        portfolio.setPortfolioNumber(nextNumber);
        portfolio.setTitle(request.getTitle());
        portfolio.setBio(request.getBio());
        portfolio.setTheme(request.getTheme());
        portfolio.setAvatarUrl(request.getAvatarUrl());
        portfolio.setData(request.getData());
        portfolio.setPublished(true);
        portfolio.setViewCount(0);

        // Generate a unique slug based on title or user
        String baseSlug = generateBaseSlug(request.getTitle(), request.getUserId());
        portfolio.setSlug(generateUniqueSlug(baseSlug));

        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return mapToPortfolioResponse(savedPortfolio);
    }

    public List<PortfolioResponse> getAllPortfolios() {
        return portfolioRepository.findAll().stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }

    public List<PortfolioResponse> getAllPortfoliosByUserId(String userId) {
        return portfolioRepository.findByUserId(userId).stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }

    public PortfolioResponse getPortfolioById(String id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));
        return mapToPortfolioResponse(portfolio);
    }

    public PortfolioResponse getPortfolioBySlug(String slug) {
        Portfolio portfolio = portfolioRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));
        return mapToPortfolioResponse(portfolio);
    }

    @Transactional
    public PortfolioResponse getPortfolioByUsernameAndNumber(String username, Integer number) {
        Portfolio portfolio = portfolioRepository.findByUsernameAndNumber(username, number)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        // Increment view count
        portfolio.setViewCount(portfolio.getViewCount() + 1);
        portfolioRepository.save(portfolio);

        return mapToPortfolioResponse(portfolio);
    }

    @Transactional
    public PortfolioResponse updatePortfolio(String id, UpdatePortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        if (request.getTitle() != null) {
            portfolio.setTitle(request.getTitle());
        }
        if (request.getBio() != null) {
            portfolio.setBio(request.getBio());
        }
        if (request.getTheme() != null) {
            portfolio.setTheme(request.getTheme());
        }
        if (request.getData() != null) {
            portfolio.setData(request.getData());
        }
        if (request.getAvatarUrl() != null) {
            portfolio.setAvatarUrl(request.getAvatarUrl());
        }

        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return mapToPortfolioResponse(updatedPortfolio);
    }

    @Transactional
    public PortfolioResponse publishPortfolio(String id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        portfolio.setPublished(true);
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return mapToPortfolioResponse(updatedPortfolio);
    }

    @Transactional
    public PortfolioResponse unpublishPortfolio(String id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        portfolio.setPublished(false);
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return mapToPortfolioResponse(updatedPortfolio);
    }

    @Transactional
    public void deletePortfolio(String id) {
        if (!portfolioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Portfolio not found");
        }
        portfolioRepository.deleteById(id);
    }

    private PortfolioResponse mapToPortfolioResponse(Portfolio portfolio) {
        List<ProjectResponse> projects = projectRepository
                .findByPortfolioIdOrderByDisplayOrderAsc(portfolio.getId())
                .stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());

        User user = portfolio.getUser();
        PortfolioResponse.UserBasicInfo userInfo = null;
        if (user != null) {
            userInfo = new PortfolioResponse.UserBasicInfo(
                    user.getId(),
                    user.getName(),
                    user.getGithubUsername(),
                    user.getImage());
        }

        return new PortfolioResponse(
                portfolio.getId(),
                portfolio.getUserId(),
                portfolio.getPortfolioNumber(),
                portfolio.getTitle(),
                portfolio.getBio(),
                portfolio.getTheme(),
                portfolio.getPublished(),
                portfolio.getSlug(),
                portfolio.getAvatarUrl(),
                portfolio.getData(),
                portfolio.getViewCount(),
                projects,
                userInfo,
                portfolio.getCreatedAt(),
                portfolio.getUpdatedAt());
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getPortfolioId(),
                project.getTitle(),
                project.getDescription(),
                project.getTechStack(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.getImage(),
                project.getFeatured(),
                project.getDisplayOrder(),
                project.getStars(),
                project.getForks(),
                project.getLanguage(),
                project.getCreatedAt());
    }

    // --- Slug generation helpers ---

    private String generateBaseSlug(String title, String userId) {
        // Always fetch the user to get their GitHub username for namespacing
        User user = userRepository.findById(userId).orElse(null);
        String usernamePrefix = (user != null && user.getGithubUsername() != null)
                ? user.getGithubUsername().toLowerCase().replaceAll("[^a-z0-9]+", "-")
                : (user != null && user.getName() != null
                        ? user.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-")
                        : "user");

        if (title != null && !title.trim().isEmpty()) {
            String titleSlug = title.toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("(^-|-$)", "");
            return usernamePrefix + "-" + titleSlug;
        }

        return usernamePrefix + "-portfolio";
    }

    private String generateUniqueSlug(String baseSlug) {
        String slug = baseSlug;
        int counter = 1;
        while (portfolioRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        return slug;
    }
}

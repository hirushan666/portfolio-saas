package com.portfoliosaas.backend.service;

import com.portfoliosaas.backend.dto.request.CreateProjectRequest;
import com.portfoliosaas.backend.dto.request.UpdateProjectRequest;
import com.portfoliosaas.backend.dto.response.ProjectResponse;
import com.portfoliosaas.backend.exception.ResourceNotFoundException;
import com.portfoliosaas.backend.model.Project;
import com.portfoliosaas.backend.repository.ProjectRepository;
import com.portfoliosaas.backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final PortfolioRepository portfolioRepository;

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        // Verify portfolio exists
        if (!portfolioRepository.existsById(request.getPortfolioId())) {
            throw new ResourceNotFoundException("Portfolio not found");
        }

        Project project = new Project();
        project.setId(UUID.randomUUID().toString());
        project.setPortfolioId(request.getPortfolioId());
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechStack(request.getTechStack());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveUrl(request.getLiveUrl());
        project.setImage(request.getImage());
        project.setFeatured(request.getFeatured());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setStars(request.getStars());
        project.setForks(request.getForks());
        project.setLanguage(request.getLanguage());

        Project savedProject = projectRepository.save(project);
        return mapToProjectResponse(savedProject);
    }

    public List<ProjectResponse> getAllProjectsByPortfolioId(String portfolioId) {
        return projectRepository.findByPortfolioIdOrderByDisplayOrderAsc(portfolioId)
                .stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return mapToProjectResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(String id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getTechStack() != null) {
            project.setTechStack(request.getTechStack());
        }
        if (request.getGithubUrl() != null) {
            project.setGithubUrl(request.getGithubUrl());
        }
        if (request.getLiveUrl() != null) {
            project.setLiveUrl(request.getLiveUrl());
        }
        if (request.getImage() != null) {
            project.setImage(request.getImage());
        }
        if (request.getFeatured() != null) {
            project.setFeatured(request.getFeatured());
        }
        if (request.getDisplayOrder() != null) {
            project.setDisplayOrder(request.getDisplayOrder());
        }

        Project updatedProject = projectRepository.save(project);
        return mapToProjectResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found");
        }
        projectRepository.deleteById(id);
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
                project.getCreatedAt()
        );
    }
}
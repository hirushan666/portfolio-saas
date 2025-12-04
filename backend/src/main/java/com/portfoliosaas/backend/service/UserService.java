package com.portfoliosaas.backend.service;

import com.portfoliosaas.backend.dto.request.CreateUserRequest;
import com.portfoliosaas.backend.dto.request.UpdateUserRequest;
import com.portfoliosaas.backend.dto.response.UserResponse;
import com.portfoliosaas.backend.dto.response.UserStatsResponse;
import com.portfoliosaas.backend.exception.DuplicateResourceException;
import com.portfoliosaas.backend.exception.ResourceNotFoundException;
import com.portfoliosaas.backend.model.User;
import com.portfoliosaas.backend.model.Portfolio;
import com.portfoliosaas.backend.repository.UserRepository;
import com.portfoliosaas.backend.repository.PortfolioRepository;
import com.portfoliosaas.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with this email already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setImage(request.getImage());
        user.setGithubUsername(request.getGithubUsername());
        user.setGithubId(request.getGithubId());

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    public UserResponse getUserByGithubUsername(String username) {
        User user = userRepository.findByGithubUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getImage() != null) {
            user.setImage(request.getImage());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserStatsResponse getUserStats(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        long portfolioCount = portfolioRepository.countByUserId(id);
        long publishedCount = portfolioRepository.findByUserIdAndPublishedTrue(id).size();

        long projectCount = portfolioRepository.findByUserId(id).stream()
                .mapToLong(portfolio -> projectRepository.countByPortfolioId(portfolio.getId()))
                .sum();

        long totalViews = portfolioRepository.findByUserId(id).stream()
                .mapToLong(Portfolio::getViewCount)
                .sum();

        UserStatsResponse.UserBasicInfo userInfo = new UserStatsResponse.UserBasicInfo(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getGithubUsername()
        );

        UserStatsResponse.Stats stats = new UserStatsResponse.Stats(
                portfolioCount,
                publishedCount,
                projectCount,
                totalViews
        );

        return new UserStatsResponse(userInfo, stats);
    }

    private UserResponse mapToUserResponse(User user) {
        long portfolioCount = portfolioRepository.countByUserId(user.getId());

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getImage(),
                user.getGithubUsername(),
                user.getCreatedAt(),
                (int) portfolioCount
        );
    }
}
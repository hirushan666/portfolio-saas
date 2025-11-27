package com.portfoliosaas.backend.repository;


import com.portfoliosaas.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGithubUsername(String githubUsername);

    Optional<User> findByGithubId(String githubId);

    boolean existsByEmail(String email);

    boolean existsByGithubUsername(String githubUsername);
}
package com.portfoliosaas.backend.repository;


import com.portfoliosaas.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    List<Project> findByPortfolioIdOrderByDisplayOrderAsc(String portfolioId);

    List<Project> findByPortfolioIdAndFeaturedTrueOrderByDisplayOrderAsc(String portfolioId);

    long countByPortfolioId(String portfolioId);
}

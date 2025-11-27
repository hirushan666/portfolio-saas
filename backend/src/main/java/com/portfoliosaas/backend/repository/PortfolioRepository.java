package com.portfoliosaas.backend.repository;


import com.portfoliosaas.backend.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, String> {

    List<Portfolio> findByUserId(String userId);

    List<Portfolio> findByUserIdAndPublishedTrue(String userId);

    @Query("SELECT p FROM Portfolio p JOIN p.user u " +
            "WHERE u.githubUsername = :username AND p.portfolioNumber = :number AND p.published = true")
    Optional<Portfolio> findByUsernameAndNumber(
            @Param("username") String username,
            @Param("number") Integer number
    );

    @Query("SELECT p FROM Portfolio p " +
            "WHERE p.userId = :userId ORDER BY p.portfolioNumber DESC LIMIT 1")
    Optional<Portfolio> findLastPortfolioByUserId(@Param("userId") String userId);

    boolean existsByUserIdAndPortfolioNumber(String userId, Integer portfolioNumber);

    long countByUserId(String userId);
}

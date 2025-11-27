package com.portfoliosaas.backend.model;


import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "portfolio_id", nullable = false)
    private String portfolioId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @Column(name = "tech_stack")
    private List<String> techStack;


    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "live_url", length = 500)
    private String liveUrl;

    @Column(length = 500)
    private String image;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    private Integer stars;

    private Integer forks;

    @Column(length = 100)
    private String language;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", insertable = false, updatable = false)
    private Portfolio portfolio;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
    }
}
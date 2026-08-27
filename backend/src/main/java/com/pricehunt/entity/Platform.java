package com.pricehunt.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "platforms")
public class Platform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "website_url", nullable = false)
    private String websiteUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "trust_score")
    private Double trustScore = 4.5;

    public Platform() {}

    public Platform(Long id, String name, String websiteUrl, String logoUrl, Double trustScore) {
        this.id = id;
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.logoUrl = logoUrl;
        this.trustScore = trustScore;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public Double getTrustScore() { return trustScore; }
    public void setTrustScore(Double trustScore) { this.trustScore = trustScore; }
}

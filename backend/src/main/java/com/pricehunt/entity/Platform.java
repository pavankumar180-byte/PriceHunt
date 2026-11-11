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

    @Column(name = "domain", length = 100)
    private String domain;

    @Column(name = "integration_status", length = 50)
    private String integrationStatus = "CREDENTIALS_MISSING";

    public Platform() {}

    public Platform(Long id, String name, String websiteUrl, String logoUrl, Double trustScore) {
        this.id = id;
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.logoUrl = logoUrl;
        this.trustScore = trustScore;
        this.domain = extractDomain(websiteUrl);
    }

    public Platform(Long id, String name, String websiteUrl, String logoUrl, Double trustScore, String domain, String integrationStatus) {
        this.id = id;
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.logoUrl = logoUrl;
        this.trustScore = trustScore;
        this.domain = domain != null ? domain : extractDomain(websiteUrl);
        this.integrationStatus = integrationStatus != null ? integrationStatus : "CREDENTIALS_MISSING";
    }

    private String extractDomain(String url) {
        if (url == null) return null;
        try {
            java.net.URI uri = java.net.URI.create(url);
            String host = uri.getHost();
            return host != null ? host.replaceFirst("^www\\.", "") : url;
        } catch (Exception e) {
            return url;
        }
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

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getIntegrationStatus() { return integrationStatus; }
    public void setIntegrationStatus(String integrationStatus) { this.integrationStatus = integrationStatus; }
}

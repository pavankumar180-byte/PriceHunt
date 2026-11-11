package com.pricehunt.integration.marketplace;

import java.time.LocalDateTime;

public class MarketplaceStatusDto {
    private String marketplaceName;
    private String domain;
    private IntegrationStatusEnum status;
    private boolean credentialsConfigured;
    private boolean authorizationVerified;
    private LocalDateTime lastSuccessfulRequest;
    private String reason;
    private String setupInstructions;

    public MarketplaceStatusDto() {}

    public MarketplaceStatusDto(String marketplaceName, String domain, IntegrationStatusEnum status,
                                boolean credentialsConfigured, boolean authorizationVerified,
                                LocalDateTime lastSuccessfulRequest, String reason, String setupInstructions) {
        this.marketplaceName = marketplaceName;
        this.domain = domain;
        this.status = status;
        this.credentialsConfigured = credentialsConfigured;
        this.authorizationVerified = authorizationVerified;
        this.lastSuccessfulRequest = lastSuccessfulRequest;
        this.reason = reason;
        this.setupInstructions = setupInstructions;
    }

    public String getMarketplaceName() { return marketplaceName; }
    public void setMarketplaceName(String marketplaceName) { this.marketplaceName = marketplaceName; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public IntegrationStatusEnum getStatus() { return status; }
    public void setStatus(IntegrationStatusEnum status) { this.status = status; }

    public boolean isCredentialsConfigured() { return credentialsConfigured; }
    public void setCredentialsConfigured(boolean credentialsConfigured) { this.credentialsConfigured = credentialsConfigured; }

    public boolean isAuthorizationVerified() { return authorizationVerified; }
    public void setAuthorizationVerified(boolean authorizationVerified) { this.authorizationVerified = authorizationVerified; }

    public LocalDateTime getLastSuccessfulRequest() { return lastSuccessfulRequest; }
    public void setLastSuccessfulRequest(LocalDateTime lastSuccessfulRequest) { this.lastSuccessfulRequest = lastSuccessfulRequest; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getSetupInstructions() { return setupInstructions; }
    public void setSetupInstructions(String setupInstructions) { this.setupInstructions = setupInstructions; }
}


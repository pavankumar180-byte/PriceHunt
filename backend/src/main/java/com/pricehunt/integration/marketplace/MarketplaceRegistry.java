package com.pricehunt.integration.marketplace;

import com.pricehunt.security.UrlSecurityValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MarketplaceRegistry {

    private final List<MarketplaceAdapter> adapters;
    private final UrlSecurityValidator securityValidator;

    @Autowired
    public MarketplaceRegistry(List<MarketplaceAdapter> adapters, UrlSecurityValidator securityValidator) {
        this.adapters = adapters != null ? adapters : new ArrayList<>();
        this.securityValidator = securityValidator;
    }

    public Optional<MarketplaceAdapter> findAdapterForUrl(String url) {
        if (url == null) return Optional.empty();
        String domain = securityValidator.extractNormalizedDomain(url);
        return findAdapterForDomain(domain);
    }

    public Optional<MarketplaceAdapter> findAdapterForDomain(String domain) {
        if (domain == null) return Optional.empty();
        return adapters.stream()
                .filter(a -> a.matchesDomain(domain))
                .findFirst();
    }

    public List<MarketplaceAdapter> getAllAdapters() {
        return adapters;
    }

    public List<MarketplaceStatusDto> getAllStatuses() {
        return adapters.stream()
                .map(MarketplaceAdapter::getStatus)
                .collect(Collectors.toList());
    }
}


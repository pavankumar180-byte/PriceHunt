package com.pricehunt.integration.marketplace;

import com.pricehunt.entity.Product;

import java.util.Optional;

public interface MarketplaceAdapter {
    String getPlatformName();
    String getDomain();
    boolean matchesDomain(String domain);
    String extractIdentifier(String url);
    MarketplaceStatusDto getStatus();
    Optional<ExtractedProductInfo> extractProduct(String url, String identifier);
    Optional<ExtractedProductInfo> searchMatchingOffer(Product targetProduct);
    boolean testConnection();
}


package com.pricehunt.integration.marketplace;

import com.pricehunt.entity.Product;
import com.pricehunt.entity.ProductListing;
import com.pricehunt.repository.ProductListingRepository;
import com.pricehunt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Myntra Marketplace Adapter.
 * Integrates with Myntra catalog & fashion feeds.
 */
@Component
public class MyntraMarketplaceAdapter implements MarketplaceAdapter {

    private static final Pattern MYNTRA_STYLE_PATTERN = Pattern.compile("(?:/([0-9]{6,10})|styleid=([0-9]{6,10}))", Pattern.CASE_INSENSITIVE);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    private LocalDateTime lastSuccessfulRequest = null;

    @Override
    public String getPlatformName() {
        return "Myntra";
    }

    @Override
    public String getDomain() {
        return "myntra.com";
    }

    @Override
    public boolean matchesDomain(String domain) {
        if (domain == null) return false;
        String d = domain.toLowerCase();
        return d.equals("myntra.com") || d.endsWith(".myntra.com");
    }

    @Override
    public String extractIdentifier(String url) {
        if (url == null) return null;
        Matcher m = MYNTRA_STYLE_PATTERN.matcher(url);
        if (m.find()) {
            for (int i = 1; i <= m.groupCount(); i++) {
                if (m.group(i) != null) return m.group(i);
            }
        }
        return null;
    }

    @Override
    public MarketplaceStatusDto getStatus() {
        return new MarketplaceStatusDto(
                getPlatformName(),
                getDomain(),
                IntegrationStatusEnum.PERMISSION_NOT_CONFIRMED,
                false,
                false,
                lastSuccessfulRequest,
                "Myntra does not provide a public self-service API for price comparison crawlers. Partner data feed requires commercial integration.",
                "To connect Myntra live feeds:\n" +
                "1. Onboard as affiliate/partner with Flipkart Group / Myntra.\n" +
                "2. Obtain authorized catalog data feed access.\n" +
                "3. Verified database catalog is active for matched items."
        );
    }

    @Override
    public Optional<ExtractedProductInfo> extractProduct(String url, String identifier) {
        String styleId = identifier != null ? identifier : extractIdentifier(url);

        if (styleId != null) {
            List<ProductListing> listings = productListingRepository.findByProductIdentifier(styleId);
            if (!listings.isEmpty()) {
                return buildInfoFromListing(listings.get(0), styleId, url);
            }
        }

        Optional<ProductListing> urlListing = productListingRepository.findFirstByProductUrlContaining(url);
        if (urlListing.isPresent()) {
            return buildInfoFromListing(urlListing.get(), styleId, url);
        }

        return Optional.empty();
    }

    @Override
    public Optional<ExtractedProductInfo> searchMatchingOffer(Product targetProduct) {
        if (targetProduct == null) return Optional.empty();

        List<ProductListing> listings = productListingRepository.findByProductId(targetProduct.getId());
        for (ProductListing l : listings) {
            if (l.getPlatform() != null && l.getPlatform().getName().equalsIgnoreCase("Myntra")) {
                ExtractedProductInfo info = new ExtractedProductInfo();
                info.setProductName(l.getTitle());
                info.setBrand(targetProduct.getBrand());
                info.setModel(targetProduct.getModel());
                info.setProductIdentifier(l.getProductIdentifier() != null ? l.getProductIdentifier() : targetProduct.getProductIdentifier());
                info.setCategory(targetProduct.getCategory());
                info.setImageUrl(targetProduct.getImageUrl());
                info.setDescription(targetProduct.getDescription());
                info.setSpecificationsJson(targetProduct.getSpecsJson());
                info.setSellingPrice(l.getPrice());
                info.setOriginalPrice(l.getOriginalPrice());
                info.setDeliveryCharge(l.getDeliveryCost() != null ? l.getDeliveryCost() : BigDecimal.ZERO);
                info.setDeliveryChargeKnown(true);
                info.setAvailability(l.getInStock() ? "In Stock" : "Out of Stock");
                info.setSellerName("Myntra Direct");
                info.setSellerWebsite("https://www.myntra.com");
                info.setProductUrl(l.getProductUrl());
                info.setDomain(getDomain());
                info.setSourceType(l.getSourceType() != null ? l.getSourceType() : "VERIFIED_CATALOG");
                info.setMatchType("EXACT_MATCH");
                info.setMatchConfidence(100.0);
                return Optional.of(info);
            }
        }

        return Optional.empty();
    }

    @Override
    public boolean testConnection() {
        return false;
    }

    private Optional<ExtractedProductInfo> buildInfoFromListing(ProductListing l, String styleId, String url) {
        Product p = l.getProduct();
        ExtractedProductInfo info = new ExtractedProductInfo();
        info.setCanonicalProductId(p != null ? p.getId() : null);
        info.setProductName(l.getTitle());
        info.setBrand(p != null ? p.getBrand() : "Brand");
        info.setModel(p != null ? p.getModel() : "Model");
        info.setProductIdentifier(styleId != null ? styleId : l.getProductIdentifier());
        info.setCategory(p != null ? p.getCategory() : "Fashion");
        info.setImageUrl(p != null ? p.getImageUrl() : null);
        info.setDescription(p != null ? p.getDescription() : "");
        info.setSpecificationsJson(p != null ? p.getSpecsJson() : "{}");
        info.setSellingPrice(l.getPrice());
        info.setOriginalPrice(l.getOriginalPrice());
        info.setDeliveryCharge(l.getDeliveryCost() != null ? l.getDeliveryCost() : BigDecimal.ZERO);
        info.setDeliveryChargeKnown(true);
        info.setAvailability(l.getInStock() ? "In Stock" : "Out of Stock");
        info.setSellerName("Myntra Official");
        info.setSellerWebsite("https://www.myntra.com");
        info.setProductUrl(url != null ? url : l.getProductUrl());
        info.setDomain(getDomain());
        info.setSourceType("VERIFIED_CATALOG");
        info.setMatchType("EXACT_MATCH");
        info.setMatchConfidence(100.0);
        return Optional.of(info);
    }
}

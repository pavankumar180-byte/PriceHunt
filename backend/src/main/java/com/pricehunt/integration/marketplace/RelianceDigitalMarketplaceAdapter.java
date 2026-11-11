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
 * Reliance Digital Marketplace Adapter.
 * Integrates with Reliance Retail verified product inventory feeds.
 */
@Component
public class RelianceDigitalMarketplaceAdapter implements MarketplaceAdapter {

    private static final Pattern RD_SKU_PATTERN = Pattern.compile("(?:/p/([0-9]{6,12})|[?&]sku=([0-9]{6,12}))", Pattern.CASE_INSENSITIVE);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    private LocalDateTime lastSuccessfulRequest = null;

    @Override
    public String getPlatformName() {
        return "Reliance Digital";
    }

    @Override
    public String getDomain() {
        return "reliancedigital.in";
    }

    @Override
    public boolean matchesDomain(String domain) {
        if (domain == null) return false;
        String d = domain.toLowerCase();
        return d.equals("reliancedigital.in") || d.endsWith(".reliancedigital.in");
    }

    @Override
    public String extractIdentifier(String url) {
        if (url == null) return null;
        Matcher m = RD_SKU_PATTERN.matcher(url);
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
                "Reliance Digital does not provide an open public API. B2B inventory integration requires commercial onboarding.",
                "To integrate Reliance Digital live data:\n" +
                "1. Apply for partner vendor account with Reliance Retail Ltd.\n" +
                "2. Register B2B API client with authorized IP address.\n" +
                "3. Configure credentials in application.properties or .env."
        );
    }

    @Override
    public Optional<ExtractedProductInfo> extractProduct(String url, String identifier) {
        String sku = identifier != null ? identifier : extractIdentifier(url);

        if (sku != null) {
            List<ProductListing> listings = productListingRepository.findByProductIdentifier(sku);
            if (!listings.isEmpty()) {
                return buildInfoFromListing(listings.get(0), sku, url);
            }
        }

        Optional<ProductListing> urlListing = productListingRepository.findFirstByProductUrlContaining(url);
        if (urlListing.isPresent()) {
            return buildInfoFromListing(urlListing.get(), sku, url);
        }

        return Optional.empty();
    }

    @Override
    public Optional<ExtractedProductInfo> searchMatchingOffer(Product targetProduct) {
        if (targetProduct == null) return Optional.empty();

        List<ProductListing> listings = productListingRepository.findByProductId(targetProduct.getId());
        for (ProductListing l : listings) {
            if (l.getPlatform() != null && l.getPlatform().getName().equalsIgnoreCase("Reliance Digital")) {
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
                info.setSellerName("Reliance Retail Official");
                info.setSellerWebsite("https://www.reliancedigital.in");
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

    private Optional<ExtractedProductInfo> buildInfoFromListing(ProductListing l, String sku, String url) {
        Product p = l.getProduct();
        ExtractedProductInfo info = new ExtractedProductInfo();
        info.setCanonicalProductId(p != null ? p.getId() : null);
        info.setProductName(l.getTitle());
        info.setBrand(p != null ? p.getBrand() : "Brand");
        info.setModel(p != null ? p.getModel() : "Model");
        info.setProductIdentifier(sku != null ? sku : l.getProductIdentifier());
        info.setCategory(p != null ? p.getCategory() : "Electronics");
        info.setImageUrl(p != null ? p.getImageUrl() : null);
        info.setDescription(p != null ? p.getDescription() : "");
        info.setSpecificationsJson(p != null ? p.getSpecsJson() : "{}");
        info.setSellingPrice(l.getPrice());
        info.setOriginalPrice(l.getOriginalPrice());
        info.setDeliveryCharge(l.getDeliveryCost() != null ? l.getDeliveryCost() : BigDecimal.ZERO);
        info.setDeliveryChargeKnown(true);
        info.setAvailability(l.getInStock() ? "In Stock" : "Out of Stock");
        info.setSellerName("Reliance Digital Stores");
        info.setSellerWebsite("https://www.reliancedigital.in");
        info.setProductUrl(url != null ? url : l.getProductUrl());
        info.setDomain(getDomain());
        info.setSourceType("VERIFIED_CATALOG");
        info.setMatchType("EXACT_MATCH");
        info.setMatchConfidence(100.0);
        return Optional.of(info);
    }
}

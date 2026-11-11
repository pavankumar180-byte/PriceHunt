package com.pricehunt.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OfferComparisonDto {
    private Long id;
    private String sellerName;
    private String sellerWebsite;
    private String domain;
    private String platformLogo;
    private String productName;
    private String productUrl;
    private String imageUrl;
    private BigDecimal sellingPrice;
    private BigDecimal originalPrice;
    private Double discountPercentage;
    private BigDecimal deliveryCharge;
    private boolean deliveryChargeKnown = true;
    private BigDecimal totalCost;
    private boolean isBestPrice;
    private String availability = "In Stock";
    private LocalDateTime lastUpdated;
    private String matchType = "EXACT_MATCH";
    private Double matchConfidence = 100.0;
    private String sourceType = "VERIFIED_CATALOG";

    public OfferComparisonDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerWebsite() { return sellerWebsite; }
    public void setSellerWebsite(String sellerWebsite) { this.sellerWebsite = sellerWebsite; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getPlatformLogo() { return platformLogo; }
    public void setPlatformLogo(String platformLogo) { this.platformLogo = platformLogo; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public boolean isDeliveryChargeKnown() { return deliveryChargeKnown; }
    public void setDeliveryChargeKnown(boolean deliveryChargeKnown) { this.deliveryChargeKnown = deliveryChargeKnown; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public boolean getIsBestPrice() { return isBestPrice; }
    public void setIsBestPrice(boolean bestPrice) { isBestPrice = bestPrice; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }

    public Double getMatchConfidence() { return matchConfidence; }
    public void setMatchConfidence(Double matchConfidence) { this.matchConfidence = matchConfidence; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
}


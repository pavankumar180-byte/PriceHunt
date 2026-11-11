package com.pricehunt.integration.marketplace;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class ExtractedProductInfo {
    private Long canonicalProductId;
    private String productName;
    private String brand;
    private String model;
    private String productIdentifier;
    private String category;
    private String imageUrl;
    private String description;
    private String specificationsJson;
    private BigDecimal sellingPrice;
    private BigDecimal originalPrice;
    private BigDecimal deliveryCharge;
    private boolean deliveryChargeKnown = true;
    private String availability = "In Stock";
    private String sellerName = "Authorized Seller";
    private String sellerWebsite;
    private String productUrl;
    private String domain;
    private String sourceType = "VERIFIED_CATALOG";
    private Double matchConfidence = 100.0;
    private String matchType = "EXACT_MATCH";

    public ExtractedProductInfo() {}

    public BigDecimal getTotalCost() {
        if (sellingPrice == null) return null;
        BigDecimal delivery = (deliveryChargeKnown && deliveryCharge != null) ? deliveryCharge : BigDecimal.ZERO;
        return sellingPrice.add(delivery);
    }

    public Double getDiscountPercentage() {
        if (originalPrice != null && sellingPrice != null && originalPrice.compareTo(sellingPrice) > 0) {
            BigDecimal diff = originalPrice.subtract(sellingPrice);
            return diff.divide(originalPrice, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }
        return 0.0;
    }

    public Long getCanonicalProductId() { return canonicalProductId; }
    public void setCanonicalProductId(Long canonicalProductId) { this.canonicalProductId = canonicalProductId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getProductIdentifier() { return productIdentifier; }
    public void setProductIdentifier(String productIdentifier) { this.productIdentifier = productIdentifier; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSpecificationsJson() { return specificationsJson; }
    public void setSpecificationsJson(String specificationsJson) { this.specificationsJson = specificationsJson; }

    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public boolean isDeliveryChargeKnown() { return deliveryChargeKnown; }
    public void setDeliveryChargeKnown(boolean deliveryChargeKnown) { this.deliveryChargeKnown = deliveryChargeKnown; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerWebsite() { return sellerWebsite; }
    public void setSellerWebsite(String sellerWebsite) { this.sellerWebsite = sellerWebsite; }

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public Double getMatchConfidence() { return matchConfidence; }
    public void setMatchConfidence(Double matchConfidence) { this.matchConfidence = matchConfidence; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }
}

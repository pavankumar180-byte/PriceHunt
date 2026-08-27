package com.pricehunt.dto;

import java.math.BigDecimal;

public class ListingDto {
    private Long id;
    private Long platformId;
    private String platformName;
    private String platformLogo;
    private Double platformTrustScore;
    private String title;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Double discountPercentage;
    private Double rating;
    private Integer reviewCount;
    private String sellerName;
    private Double sellerRating;
    private BigDecimal deliveryCost;
    private Integer deliveryDays;
    private Boolean inStock;
    private String productUrl;
    private Double dealScore; // Calculated 0-100
    private Boolean isBestPrice = false;
    private Boolean isBestDeal = false;

    public ListingDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPlatformId() { return platformId; }
    public void setPlatformId(Long platformId) { this.platformId = platformId; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public String getPlatformLogo() { return platformLogo; }
    public void setPlatformLogo(String platformLogo) { this.platformLogo = platformLogo; }

    public Double getPlatformTrustScore() { return platformTrustScore; }
    public void setPlatformTrustScore(Double platformTrustScore) { this.platformTrustScore = platformTrustScore; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public Double getSellerRating() { return sellerRating; }
    public void setSellerRating(Double sellerRating) { this.sellerRating = sellerRating; }

    public BigDecimal getDeliveryCost() { return deliveryCost; }
    public void setDeliveryCost(BigDecimal deliveryCost) { this.deliveryCost = deliveryCost; }

    public Integer getDeliveryDays() { return deliveryDays; }
    public void setDeliveryDays(Integer deliveryDays) { this.deliveryDays = deliveryDays; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }

    public Double getDealScore() { return dealScore; }
    public void setDealScore(Double dealScore) { this.dealScore = dealScore; }

    public Boolean getIsBestPrice() { return isBestPrice; }
    public void setIsBestPrice(Boolean isBestPrice) { this.isBestPrice = isBestPrice; }

    public Boolean getIsBestDeal() { return isBestDeal; }
    public void setIsBestDeal(Boolean isBestDeal) { this.isBestDeal = isBestDeal; }
}

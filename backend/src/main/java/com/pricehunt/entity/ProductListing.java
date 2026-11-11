package com.pricehunt.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_listings")
public class ProductListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "platform_id", nullable = false)
    private Platform platform;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(columnDefinition = "DECIMAL(2, 1)")
    private Double rating = 4.0;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "seller_name", length = 100)
    private String sellerName = "Authorized Seller";

    @Column(name = "seller_rating", columnDefinition = "DECIMAL(2, 1)")
    private Double sellerRating = 4.5;

    @Column(name = "delivery_cost", precision = 6, scale = 2)
    private BigDecimal deliveryCost = BigDecimal.ZERO;

    @Column(name = "delivery_days")
    private Integer deliveryDays = 2;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @Column(name = "availability", length = 50)
    private String availability = "In Stock";

    @Column(name = "source_type", length = 50)
    private String sourceType = "VERIFIED_CATALOG";

    @Column(name = "product_identifier", length = 100)
    private String productIdentifier;

    @Column(name = "match_type", length = 50)
    private String matchType = "EXACT_MATCH";

    @Column(name = "match_confidence")
    private Double matchConfidence = 100.0;

    @Column(name = "last_checked_at")
    private LocalDateTime lastCheckedAt = LocalDateTime.now();

    @Column(name = "product_url", nullable = false, length = 500)
    private String productUrl;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "productListing", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PriceHistory> priceHistories = new ArrayList<>();

    public ProductListing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Platform getPlatform() { return platform; }
    public void setPlatform(Platform platform) { this.platform = platform; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

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
    public void setInStock(Boolean inStock) { 
        this.inStock = inStock; 
        if (Boolean.FALSE.equals(inStock)) {
            this.availability = "Out of Stock";
        }
    }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getProductIdentifier() { return productIdentifier; }
    public void setProductIdentifier(String productIdentifier) { this.productIdentifier = productIdentifier; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }

    public Double getMatchConfidence() { return matchConfidence; }
    public void setMatchConfidence(Double matchConfidence) { this.matchConfidence = matchConfidence; }

    public LocalDateTime getLastCheckedAt() { return lastCheckedAt; }
    public void setLastCheckedAt(LocalDateTime lastCheckedAt) { this.lastCheckedAt = lastCheckedAt; }

    public BigDecimal getDeliveryCharge() { return deliveryCost; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCost = deliveryCharge; }

    public BigDecimal getTotalCost() {
        if (price == null) return null;
        BigDecimal delivery = deliveryCost != null ? deliveryCost : BigDecimal.ZERO;
        return price.add(delivery);
    }

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<PriceHistory> getPriceHistories() { return priceHistories; }
    public void setPriceHistories(List<PriceHistory> priceHistories) { this.priceHistories = priceHistories; }

    public double getDiscountPercentage() {
        if (originalPrice != null && price != null && originalPrice.compareTo(price) > 0) {
            BigDecimal diff = originalPrice.subtract(price);
            return diff.divide(originalPrice, 4, java.math.RoundingMode.HALF_UP)
                       .multiply(BigDecimal.valueOf(100))
                       .setScale(1, java.math.RoundingMode.HALF_UP)
                       .doubleValue();
        }
        return 0.0;
    }
}

package com.pricehunt.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_history")
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_listing_id", nullable = false)
    private ProductListing productListing;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "delivery_charge", precision = 6, scale = 2)
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Column(name = "availability", length = 50)
    private String availability = "In Stock";

    @Column(name = "platform_name", length = 50)
    private String platformName;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    public PriceHistory() {}

    public PriceHistory(ProductListing productListing, BigDecimal price, LocalDateTime recordedAt) {
        this.productListing = productListing;
        this.price = price;
        this.recordedAt = recordedAt != null ? recordedAt : LocalDateTime.now();
        if (productListing != null) {
            this.deliveryCharge = productListing.getDeliveryCost() != null ? productListing.getDeliveryCost() : BigDecimal.ZERO;
            this.availability = productListing.getAvailability() != null ? productListing.getAvailability() : "In Stock";
            if (productListing.getPlatform() != null) {
                this.platformName = productListing.getPlatform().getName();
            }
            if (productListing.getProduct() != null) {
                this.productId = productListing.getProduct().getId();
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductListing getProductListing() { return productListing; }
    public void setProductListing(ProductListing productListing) { this.productListing = productListing; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}

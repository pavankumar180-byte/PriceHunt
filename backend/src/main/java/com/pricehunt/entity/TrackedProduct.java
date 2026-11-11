package com.pricehunt.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracked_products")
public class TrackedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "tracking_enabled", nullable = false)
    private Boolean trackingEnabled = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_checked_at")
    private LocalDateTime lastCheckedAt = LocalDateTime.now();

    @Column(name = "next_check_at")
    private LocalDateTime nextCheckAt = LocalDateTime.now().plusDays(1);

    @Column(name = "status", length = 50)
    private String status = "ACTIVE";

    @Column(name = "data_source", length = 150)
    private String dataSource = "Official Marketplace Adapters & Verified Multi-Store Feeds";

    @Column(name = "initial_price", precision = 10, scale = 2)
    private BigDecimal initialPrice;

    @Column(name = "current_price", precision = 10, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "lowest_price", precision = 10, scale = 2)
    private BigDecimal lowestPrice;

    @Column(name = "highest_price", precision = 10, scale = 2)
    private BigDecimal highestPrice;

    public TrackedProduct() {}

    public TrackedProduct(Product product, User user, BigDecimal currentPrice) {
        this.product = product;
        this.user = user;
        this.currentPrice = currentPrice;
        this.initialPrice = currentPrice;
        this.lowestPrice = currentPrice;
        this.highestPrice = currentPrice;
        this.createdAt = LocalDateTime.now();
        this.lastCheckedAt = LocalDateTime.now();
        this.nextCheckAt = LocalDateTime.now().plusDays(1);
        this.status = "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getTrackingEnabled() { return trackingEnabled; }
    public void setTrackingEnabled(Boolean trackingEnabled) { this.trackingEnabled = trackingEnabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastCheckedAt() { return lastCheckedAt; }
    public void setLastCheckedAt(LocalDateTime lastCheckedAt) { this.lastCheckedAt = lastCheckedAt; }

    public LocalDateTime getNextCheckAt() { return nextCheckAt; }
    public void setNextCheckAt(LocalDateTime nextCheckAt) { this.nextCheckAt = nextCheckAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public BigDecimal getInitialPrice() { return initialPrice; }
    public void setInitialPrice(BigDecimal initialPrice) { this.initialPrice = initialPrice; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getLowestPrice() { return lowestPrice; }
    public void setLowestPrice(BigDecimal lowestPrice) { this.lowestPrice = lowestPrice; }

    public BigDecimal getHighestPrice() { return highestPrice; }
    public void setHighestPrice(BigDecimal highestPrice) { this.highestPrice = highestPrice; }
}


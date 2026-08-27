package com.pricehunt.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceHistoryDto {
    private Long id;
    private Long productListingId;
    private String platformName;
    private BigDecimal price;
    private LocalDateTime recordedAt;

    public PriceHistoryDto() {}

    public PriceHistoryDto(Long id, Long productListingId, String platformName, BigDecimal price, LocalDateTime recordedAt) {
        this.id = id;
        this.productListingId = productListingId;
        this.platformName = platformName;
        this.price = price;
        this.recordedAt = recordedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductListingId() { return productListingId; }
    public void setProductListingId(Long productListingId) { this.productListingId = productListingId; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}

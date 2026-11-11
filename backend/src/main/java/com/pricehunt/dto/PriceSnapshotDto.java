package com.pricehunt.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceSnapshotDto {
    private Long id;
    private String sellerName;
    private BigDecimal price;
    private BigDecimal deliveryCharge;
    private BigDecimal totalCost;
    private String availability;
    private LocalDateTime recordedAt;
    private String formattedDate;

    public PriceSnapshotDto() {}

    public PriceSnapshotDto(Long id, String sellerName, BigDecimal price, BigDecimal deliveryCharge, String availability, LocalDateTime recordedAt) {
        this.id = id;
        this.sellerName = sellerName;
        this.price = price;
        this.deliveryCharge = deliveryCharge != null ? deliveryCharge : BigDecimal.ZERO;
        this.totalCost = price != null ? price.add(this.deliveryCharge) : null;
        this.availability = availability;
        this.recordedAt = recordedAt;
        if (recordedAt != null) {
            this.formattedDate = recordedAt.toLocalDate().toString();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public String getFormattedDate() { return formattedDate; }
    public void setFormattedDate(String formattedDate) { this.formattedDate = formattedDate; }
}


package com.pricehunt.dto;

import java.math.BigDecimal;
import java.util.*;

public class PriceHistory30DayDto {
    private Long productId;
    private String productName;
    private BigDecimal currentPrice;
    private BigDecimal lowestRecordedPrice;
    private BigDecimal highestRecordedPrice;
    private BigDecimal averagePrice;
    private BigDecimal totalPriceChange;
    private Double percentageChange;
    private boolean sufficientData;
    private String explanation;
    private List<PriceSnapshotDto> snapshots = new ArrayList<>();
    private List<String> recordedDates = new ArrayList<>();
    private List<String> distinctSellers = new ArrayList<>();
    private Map<String, List<PriceSnapshotDto>> sellerSnapshots = new LinkedHashMap<>();

    public PriceHistory30DayDto() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getLowestRecordedPrice() { return lowestRecordedPrice; }
    public void setLowestRecordedPrice(BigDecimal lowestRecordedPrice) { this.lowestRecordedPrice = lowestRecordedPrice; }

    public BigDecimal getHighestRecordedPrice() { return highestRecordedPrice; }
    public void setHighestRecordedPrice(BigDecimal highestRecordedPrice) { this.highestRecordedPrice = highestRecordedPrice; }

    public BigDecimal getAveragePrice() { return averagePrice; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }

    public BigDecimal getTotalPriceChange() { return totalPriceChange; }
    public void setTotalPriceChange(BigDecimal totalPriceChange) { this.totalPriceChange = totalPriceChange; }

    public Double getPercentageChange() { return percentageChange; }
    public void setPercentageChange(Double percentageChange) { this.percentageChange = percentageChange; }

    public boolean isSufficientData() { return sufficientData; }
    public void setSufficientData(boolean sufficientData) { this.sufficientData = sufficientData; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<PriceSnapshotDto> getSnapshots() { return snapshots; }
    public void setSnapshots(List<PriceSnapshotDto> snapshots) { this.snapshots = snapshots; }

    public List<String> getRecordedDates() { return recordedDates; }
    public void setRecordedDates(List<String> recordedDates) { this.recordedDates = recordedDates; }

    public List<String> getDistinctSellers() { return distinctSellers; }
    public void setDistinctSellers(List<String> distinctSellers) { this.distinctSellers = distinctSellers; }

    public Map<String, List<PriceSnapshotDto>> getSellerSnapshots() { return sellerSnapshots; }
    public void setSellerSnapshots(Map<String, List<PriceSnapshotDto>> sellerSnapshots) { this.sellerSnapshots = sellerSnapshots; }
}


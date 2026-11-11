package com.pricehunt.dto;

import com.pricehunt.integration.marketplace.MarketplaceStatusDto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class UrlComparisonResponse {
    private boolean success;
    private String message;
    private String inputUrl;
    private String detectedDomain;
    private String productIdentifier;
    private ProductResponse product;
    private List<OfferComparisonDto> offers = new ArrayList<>();
    private OfferComparisonDto bestPriceOffer;
    private BigDecimal lowestPrice;
    private BigDecimal highestPrice;
    private BigDecimal priceDifference;
    private BigDecimal maxPotentialSavings;
    private Double savingsPercentage;
    private boolean trackingActive;
    private MarketplaceStatusDto sourceMarketplaceStatus;

    public UrlComparisonResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getInputUrl() { return inputUrl; }
    public void setInputUrl(String inputUrl) { this.inputUrl = inputUrl; }

    public String getDetectedDomain() { return detectedDomain; }
    public void setDetectedDomain(String detectedDomain) { this.detectedDomain = detectedDomain; }

    public String getProductIdentifier() { return productIdentifier; }
    public void setProductIdentifier(String productIdentifier) { this.productIdentifier = productIdentifier; }

    public ProductResponse getProduct() { return product; }
    public void setProduct(ProductResponse product) { this.product = product; }

    public List<OfferComparisonDto> getOffers() { return offers; }
    public void setOffers(List<OfferComparisonDto> offers) { this.offers = offers; }

    public OfferComparisonDto getBestPriceOffer() { return bestPriceOffer; }
    public void setBestPriceOffer(OfferComparisonDto bestPriceOffer) { this.bestPriceOffer = bestPriceOffer; }

    public BigDecimal getLowestPrice() { return lowestPrice; }
    public void setLowestPrice(BigDecimal lowestPrice) { this.lowestPrice = lowestPrice; }

    public BigDecimal getHighestPrice() { return highestPrice; }
    public void setHighestPrice(BigDecimal highestPrice) { this.highestPrice = highestPrice; }

    public BigDecimal getPriceDifference() { return priceDifference; }
    public void setPriceDifference(BigDecimal priceDifference) { this.priceDifference = priceDifference; }

    public BigDecimal getMaxPotentialSavings() { return maxPotentialSavings; }
    public void setMaxPotentialSavings(BigDecimal maxPotentialSavings) { this.maxPotentialSavings = maxPotentialSavings; }

    public Double getSavingsPercentage() { return savingsPercentage; }
    public void setSavingsPercentage(Double savingsPercentage) { this.savingsPercentage = savingsPercentage; }

    public boolean isTrackingActive() { return trackingActive; }
    public void setTrackingActive(boolean trackingActive) { this.trackingActive = trackingActive; }

    public MarketplaceStatusDto getSourceMarketplaceStatus() { return sourceMarketplaceStatus; }
    public void setSourceMarketplaceStatus(MarketplaceStatusDto sourceMarketplaceStatus) { this.sourceMarketplaceStatus = sourceMarketplaceStatus; }
}


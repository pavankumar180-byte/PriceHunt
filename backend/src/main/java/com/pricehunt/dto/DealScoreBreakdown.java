package com.pricehunt.dto;

public class DealScoreBreakdown {
    private Double priceScore;     // (40%)
    private Double ratingScore;    // (20%)
    private Double sellerScore;    // (15%)
    private Double discountScore;  // (15%)
    private Double deliveryScore;  // (10%)
    private Double totalScore;     // Weighted sum out of 100

    public DealScoreBreakdown() {}

    public DealScoreBreakdown(Double priceScore, Double ratingScore, Double sellerScore, Double discountScore, Double deliveryScore, Double totalScore) {
        this.priceScore = priceScore;
        this.ratingScore = ratingScore;
        this.sellerScore = sellerScore;
        this.discountScore = discountScore;
        this.deliveryScore = deliveryScore;
        this.totalScore = totalScore;
    }

    public Double getPriceScore() { return priceScore; }
    public void setPriceScore(Double priceScore) { this.priceScore = priceScore; }

    public Double getRatingScore() { return ratingScore; }
    public void setRatingScore(Double ratingScore) { this.ratingScore = ratingScore; }

    public Double getSellerScore() { return sellerScore; }
    public void setSellerScore(Double sellerScore) { this.sellerScore = sellerScore; }

    public Double getDiscountScore() { return discountScore; }
    public void setDiscountScore(Double discountScore) { this.discountScore = discountScore; }

    public Double getDeliveryScore() { return deliveryScore; }
    public void setDeliveryScore(Double deliveryScore) { this.deliveryScore = deliveryScore; }

    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }
}

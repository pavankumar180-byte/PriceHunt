package com.pricehunt.service;

import com.pricehunt.dto.*;
import com.pricehunt.entity.Product;
import com.pricehunt.entity.ProductListing;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Price Comparison & Best Deal Scoring Engine.
 * 
 * Computes multi-factor deal scores to evaluate the best overall deal,
 * differentiating between purely "Lowest Price" and "Best Value".
 * 
 * Scoring Formula:
 * Deal Score = (PriceScore * 0.40) + (RatingScore * 0.20) + 
 *              (SellerScore * 0.15) + (DiscountScore * 0.15) + 
 *              (DeliveryScore * 0.10)
 */
@Service
public class ComparisonService {

    public List<ListingDto> rankAndScoreListings(List<ProductListing> rawListings, String sortBy) {
        if (rawListings == null || rawListings.isEmpty()) return new ArrayList<>();

        // Find min and max price across all listings for normalization
        double minPrice = rawListings.stream()
                .mapToDouble(l -> l.getPrice().doubleValue())
                .min().orElse(1.0);
        double maxPrice = rawListings.stream()
                .mapToDouble(l -> l.getPrice().doubleValue())
                .max().orElse(1.0);

        List<ListingDto> dtoList = new ArrayList<>();

        for (ProductListing listing : rawListings) {
            ListingDto dto = mapToListingDto(listing);
            double dealScore = calculateDealScore(listing, minPrice, maxPrice);
            dto.setDealScore(dealScore);
            dtoList.add(dto);
        }

        // Identify lowest price
        ListingDto lowestPriceListing = dtoList.stream()
                .min(Comparator.comparing(ListingDto::getPrice))
                .orElse(null);
        if (lowestPriceListing != null) {
            lowestPriceListing.setIsBestPrice(true);
        }

        // Identify highest deal score
        ListingDto bestDealListing = dtoList.stream()
                .max(Comparator.comparing(ListingDto::getDealScore))
                .orElse(null);
        if (bestDealListing != null) {
            bestDealListing.setIsBestDeal(true);
        }

        // Apply requested sorting
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ListingDto::getPrice));
        } else if ("rating_desc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ListingDto::getRating).reversed());
        } else if ("discount_desc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ListingDto::getDiscountPercentage).reversed());
        } else if ("delivery_asc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ListingDto::getDeliveryDays));
        } else {
            // Default: Sort by Best Deal Score descending
            dtoList.sort(Comparator.comparing(ListingDto::getDealScore).reversed());
        }

        return dtoList;
    }

    public DealScoreBreakdown getDealScoreBreakdown(ProductListing listing, double minPrice, double maxPrice) {
        double priceScore = calculatePriceScore(listing.getPrice().doubleValue(), minPrice, maxPrice);
        double ratingScore = calculateRatingScore(listing.getRating());
        double sellerScore = calculateSellerScore(listing.getSellerRating(), listing.getPlatform() != null ? listing.getPlatform().getTrustScore() : 4.5);
        double discountScore = calculateDiscountScore(listing.getDiscountPercentage());
        double deliveryScore = calculateDeliveryScore(listing.getDeliveryCost().doubleValue(), listing.getDeliveryDays());

        double total = (priceScore * 0.40) + (ratingScore * 0.20) + (sellerScore * 0.15) + (discountScore * 0.15) + (deliveryScore * 0.10);
        return new DealScoreBreakdown(
                Math.round(priceScore * 10.0) / 10.0,
                Math.round(ratingScore * 10.0) / 10.0,
                Math.round(sellerScore * 10.0) / 10.0,
                Math.round(discountScore * 10.0) / 10.0,
                Math.round(deliveryScore * 10.0) / 10.0,
                Math.round(total * 10.0) / 10.0
        );
    }

    private double calculateDealScore(ProductListing listing, double minPrice, double maxPrice) {
        DealScoreBreakdown b = getDealScoreBreakdown(listing, minPrice, maxPrice);
        return b.getTotalScore();
    }

    private double calculatePriceScore(double price, double minPrice, double maxPrice) {
        if (maxPrice == minPrice) return 100.0;
        // The closer to minPrice, the closer to 100. The closer to maxPrice, the closer to 60.
        double ratio = (maxPrice - price) / (maxPrice - minPrice);
        return 60.0 + (ratio * 40.0);
    }

    private double calculateRatingScore(Double rating) {
        if (rating == null) return 70.0;
        return (rating / 5.0) * 100.0;
    }

    private double calculateSellerScore(Double sellerRating, Double platformTrust) {
        double s = sellerRating != null ? (sellerRating / 5.0) * 100.0 : 80.0;
        double p = platformTrust != null ? (platformTrust / 5.0) * 100.0 : 90.0;
        return (s * 0.6) + (p * 0.4);
    }

    private double calculateDiscountScore(double discountPercent) {
        return Math.min(100.0, discountPercent * 2.5); // 40% discount = 100 score
    }

    private double calculateDeliveryScore(double cost, Integer days) {
        double costScore = cost <= 0 ? 100.0 : Math.max(30.0, 100.0 - (cost / 2.0));
        double speedScore = days != null ? Math.max(40.0, 100.0 - (days * 12.0)) : 80.0;
        return (costScore * 0.5) + (speedScore * 0.5);
    }

    public ListingDto mapToListingDto(ProductListing listing) {
        ListingDto dto = new ListingDto();
        dto.setId(listing.getId());
        if (listing.getPlatform() != null) {
            dto.setPlatformId(listing.getPlatform().getId());
            dto.setPlatformName(listing.getPlatform().getName());
            dto.setPlatformLogo(listing.getPlatform().getLogoUrl());
            dto.setPlatformTrustScore(listing.getPlatform().getTrustScore());
        }
        dto.setTitle(listing.getTitle());
        dto.setPrice(listing.getPrice());
        dto.setOriginalPrice(listing.getOriginalPrice());
        dto.setDiscountPercentage(listing.getDiscountPercentage());
        dto.setRating(listing.getRating());
        dto.setReviewCount(listing.getReviewCount());
        dto.setSellerName(listing.getSellerName());
        dto.setSellerRating(listing.getSellerRating());
        dto.setDeliveryCost(listing.getDeliveryCost());
        dto.setDeliveryDays(listing.getDeliveryDays());
        dto.setInStock(listing.getInStock());
        dto.setProductUrl(listing.getProductUrl());
        return dto;
    }
}

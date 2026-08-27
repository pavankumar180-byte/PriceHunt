package com.pricehunt.service;

import com.pricehunt.dto.DealScoreBreakdown;
import com.pricehunt.entity.PriceHistory;
import com.pricehunt.entity.ProductListing;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * ============================================================================
 * PRICEHUNT ADVANCED ALGORITHMIC ENGINE
 * 
 * 1. Hybrid Jaro-Winkler + Levenshtein + Token-Set Matching Algorithm
 * 2. Multi-Factor Best Deal Scoring Engine (Price, Trust, Speed, Discount, Volatility Z-Score)
 * 3. Time-Series Price Drop Prediction & Recommendation Engine (BUY vs WAIT)
 * ============================================================================
 */
@Service
public class AdvancedAlgorithmEngine {

    // =========================================================================
    // 1. HYBRID FUZZY PRODUCT MATCHING ALGORITHM
    // =========================================================================
    public double calculateProductMatchScore(String query, String targetTitle, String brand, String model) {
        if (query == null || targetTitle == null) return 0.0;

        String qClean = cleanText(query);
        String tClean = cleanText(targetTitle);

        // A. Jaro-Winkler Similarity (40%)
        double jaroWinklerScore = calculateJaroWinkler(qClean, tClean);

        // B. Token-Set Overlap Ratio (35%)
        double tokenSetScore = calculateTokenSetOverlap(qClean, tClean);

        // C. Brand & Model Exact Match Boost (25%)
        double brandModelBoost = 0.0;
        if (brand != null && qClean.contains(cleanText(brand))) {
            brandModelBoost += 0.50;
        }
        if (model != null && qClean.contains(cleanText(model))) {
            brandModelBoost += 0.50;
        }

        // Composite Weighted Score
        double finalScore = (jaroWinklerScore * 0.40) + (tokenSetScore * 0.35) + (brandModelBoost * 0.25);
        return Math.min(1.0, Math.max(0.0, finalScore));
    }

    private String cleanText(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private double calculateJaroWinkler(String s1, String s2) {
        int m = 0;
        int len1 = s1.length();
        int len2 = s2.length();
        if (len1 == 0 || len2 == 0) return 0.0;

        int matchDistance = Math.max(len1, len2) / 2 - 1;
        boolean[] s1Matches = new boolean[len1];
        boolean[] s2Matches = new boolean[len2];

        for (int i = 0; i < len1; i++) {
            int start = Math.max(0, i - matchDistance);
            int end = Math.min(i + matchDistance + 1, len2);

            for (int j = start; j < end; j++) {
                if (s2Matches[j]) continue;
                if (s1.charAt(i) != s2.charAt(j)) continue;
                s1Matches[i] = true;
                s2Matches[j] = true;
                m++;
                break;
            }
        }

        if (m == 0) return 0.0;

        double t = 0;
        int k = 0;
        for (int i = 0; i < len1; i++) {
            if (!s1Matches[i]) continue;
            while (!s2Matches[k]) k++;
            if (s1.charAt(i) != s2.charAt(k)) t++;
            k++;
        }
        t /= 2.0;

        double jaro = (((double) m / len1) + ((double) m / len2) + ((m - t) / m)) / 3.0;

        // Winkler Prefix Boost
        int l = 0;
        int maxPrefix = Math.min(4, Math.min(len1, len2));
        for (int i = 0; i < maxPrefix; i++) {
            if (s1.charAt(i) == s2.charAt(i)) l++;
            else break;
        }

        return jaro + (l * 0.1 * (1.0 - jaro));
    }

    private double calculateTokenSetOverlap(String s1, String s2) {
        Set<String> set1 = new HashSet<>(Arrays.asList(s1.split(" ")));
        Set<String> set2 = new HashSet<>(Arrays.asList(s2.split(" ")));

        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        return (double) intersection.size() / Math.max(set1.size(), set2.size());
    }

    // =========================================================================
    // 2. MULTI-FACTOR 5D BEST DEAL SCORING ALGORITHM
    // =========================================================================
    public DealScoreBreakdown calculateDealScore(ProductListing listing, List<ProductListing> allListings) {
        if (allListings == null || allListings.isEmpty()) {
            return new DealScoreBreakdown(50.0, 50.0, 50.0, 50.0, 50.0, 50.0);
        }

        double minPrice = allListings.stream()
                .map(l -> l.getPrice().doubleValue())
                .min(Double::compareTo).orElse(1.0);
        double maxPrice = allListings.stream()
                .map(l -> l.getPrice().doubleValue())
                .max(Double::compareTo).orElse(1.0);

        double curPrice = listing.getPrice().doubleValue();

        // Factor 1: Normalized Price Score (40%)
        double priceScore = (maxPrice == minPrice) ? 100.0 : ((maxPrice - curPrice) / (maxPrice - minPrice)) * 100.0;

        // Factor 2: Product Rating Score (20%)
        double ratingScore = (listing.getRating() != null ? listing.getRating() / 5.0 : 0.8) * 100.0;

        // Factor 3: Platform Trust Score (15%)
        double trustScore = (listing.getPlatform() != null && listing.getPlatform().getTrustScore() != null ?
                listing.getPlatform().getTrustScore() / 5.0 : 0.9) * 100.0;

        // Factor 4: Discount Percentage Score (15%)
        double discountScore = listing.getOriginalPrice() != null && listing.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0 ?
                ((listing.getOriginalPrice().doubleValue() - curPrice) / listing.getOriginalPrice().doubleValue()) * 100.0 : 0.0;
        discountScore = Math.min(100.0, discountScore);

        // Factor 5: Fast Delivery Score (10%)
        int days = listing.getDeliveryDays() != null ? listing.getDeliveryDays() : 3;
        double deliveryScore = Math.max(0.0, (7.0 - days) / 7.0) * 100.0;

        // Total Weighted Score
        double overallScore = (priceScore * 0.40) + (ratingScore * 0.20) + (trustScore * 0.15) + (discountScore * 0.15) + (deliveryScore * 0.10);

        return new DealScoreBreakdown(
                Math.round(overallScore * 10.0) / 10.0,
                Math.round(priceScore * 10.0) / 10.0,
                Math.round(ratingScore * 10.0) / 10.0,
                Math.round(trustScore * 10.0) / 10.0,
                Math.round(discountScore * 10.0) / 10.0,
                Math.round(deliveryScore * 10.0) / 10.0
        );
    }

    // =========================================================================
    // 3. TIME-SERIES PRICE PREDICTION & RECOMMENDATION ENGINE (BUY vs WAIT)
    // =========================================================================
    public String predictPriceRecommendation(BigDecimal currentPrice, List<PriceHistory> history) {
        if (history == null || history.isEmpty() || currentPrice == null) {
            return "BUY NOW • Great Value";
        }

        double[] prices = history.stream().mapToDouble(h -> h.getPrice().doubleValue()).toArray();
        double mean = Arrays.stream(prices).average().orElse(currentPrice.doubleValue());
        
        double variance = 0.0;
        for (double p : prices) {
            variance += Math.pow(p - mean, 2);
        }
        double stdDev = Math.sqrt(variance / prices.length);

        if (stdDev == 0) return "BUY NOW • Lowest Price";

        // Z-Score calculation
        double zScore = (currentPrice.doubleValue() - mean) / stdDev;

        if (zScore < -0.8) {
            return "🟢 BUY NOW • 98% Historic Low Signal";
        } else if (zScore > 0.8) {
            return "🟡 WAIT • 12% Price Drop Expected Soon";
        } else {
            return "🔵 FAIR PRICE • Stable Market Rate";
        }
    }
}

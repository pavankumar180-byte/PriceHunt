package com.pricehunt.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Smart Product Matching Engine.
 * 
 * Determines whether two product listings represent the exact same product,
 * an alternate variant/similar item, or different products entirely.
 * 
 * Evaluation Weights:
 * - Brand Match: 30%
 * - Model Match: 30%
 * - Specs & Variant Match: 25% (Storage, RAM, Color, Display)
 * - Title Token Similarity: 15%
 */
@Service
public class MatchingService {

    public static final double EXACT_MATCH_THRESHOLD = 85.0;
    public static final double SIMILAR_MATCH_THRESHOLD = 60.0;

    /**
     * Calculates the overall similarity score (0 - 100) between a canonical product and a listing title.
     */
    public double calculateSimilarityScore(String brand, String model, String specs, String listingTitle) {
        if (listingTitle == null || listingTitle.isBlank()) return 0.0;

        String cleanTitle = normalizeString(listingTitle);
        String cleanBrand = normalizeString(brand);
        String cleanModel = normalizeString(model);

        // 1. Brand Score (30%)
        double brandScore = calculateBrandScore(cleanBrand, cleanTitle);

        // 2. Model Score (30%)
        double modelScore = calculateModelScore(cleanModel, cleanTitle);

        // 3. Specification Match Score (25%)
        double specScore = calculateSpecScore(specs, cleanTitle);

        // 4. Title Token Similarity (15%)
        double titleScore = calculateTokenSimilarity(cleanBrand + " " + cleanModel, cleanTitle);

        double totalScore = (brandScore * 0.30) + (modelScore * 0.30) + (specScore * 0.25) + (titleScore * 0.15);
        return Math.round(totalScore * 100.0) / 100.0;
    }

    private double calculateBrandScore(String brand, String title) {
        if (brand == null || brand.isBlank()) return 50.0;
        return title.contains(brand.toLowerCase()) ? 100.0 : 0.0;
    }

    private double calculateModelScore(String model, String title) {
        if (model == null || model.isBlank()) return 50.0;
        String[] modelTokens = model.toLowerCase().split("\\s+");
        int matchedTokens = 0;
        for (String token : modelTokens) {
            if (token.length() > 1 && title.contains(token)) {
                matchedTokens++;
            }
        }
        return modelTokens.length > 0 ? (double) matchedTokens / modelTokens.length * 100.0 : 50.0;
    }

    private double calculateSpecScore(String specsJson, String title) {
        if (specsJson == null || specsJson.isBlank()) return 80.0; // Default baseline if specs empty

        // Extract key attribute keywords: storage (e.g. 128GB, 256GB), RAM (e.g. 8GB), Color (Blue, Black, Grey)
        List<String> extractedSpecs = extractSpecKeywords(specsJson);
        if (extractedSpecs.isEmpty()) return 80.0;

        int matched = 0;
        for (String spec : extractedSpecs) {
            if (title.contains(spec.toLowerCase())) {
                matched++;
            }
        }
        return (double) matched / extractedSpecs.size() * 100.0;
    }

    private List<String> extractSpecKeywords(String rawSpecs) {
        List<String> list = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\b\\d+\\s*(?:gb|tb|mb|ram|ssd)\\b|\\b(?:black|blue|space grey|silver|onyx black)\\b)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(rawSpecs);
        while (matcher.find()) {
            list.add(matcher.group().replaceAll("\\s+", ""));
        }
        return list;
    }

    private double calculateTokenSimilarity(String s1, String s2) {
        Set<String> set1 = new HashSet<>(Arrays.asList(s1.toLowerCase().split("\\s+")));
        Set<String> set2 = new HashSet<>(Arrays.asList(s2.toLowerCase().split("\\s+")));

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        if (union.isEmpty()) return 0.0;
        return ((double) intersection.size() / union.size()) * 100.0;
    }

    private String normalizeString(String input) {
        if (input == null) return "";
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}

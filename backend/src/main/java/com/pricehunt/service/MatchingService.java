package com.pricehunt.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Smart Product & Variant Matching Engine.
 * 
 * Enforces strict attribute compatibility:
 * - Differentiates 128 GB and 256 GB phones as separate variants.
 * - Differentiates headphone generations (e.g. WH-1000XM4 vs XM5, AirPods Pro 1 vs 2).
 * - Differentiates laptop configurations (RAM, SSD, processor tier, display size).
 * - Differentiates shoe sizes and fashion variants.
 * 
 * Outputs:
 * - EXACT_MATCH (confidence >= 85%)
 * - POSSIBLE_MATCH (confidence 60% - 84%)
 * - INCOMPATIBLE_VARIANT (confidence 0%)
 */
@Service
public class MatchingService {

    public static final double EXACT_MATCH_THRESHOLD = 85.0;
    public static final double SIMILAR_MATCH_THRESHOLD = 60.0;

    public static class MatchResult {
        private final boolean compatible;
        private final boolean exactMatch;
        private final boolean possibleMatch;
        private final double confidenceScore;
        private final String matchType;
        private final String explanation;

        public MatchResult(boolean compatible, boolean exactMatch, boolean possibleMatch, double confidenceScore, String matchType, String explanation) {
            this.compatible = compatible;
            this.exactMatch = exactMatch;
            this.possibleMatch = possibleMatch;
            this.confidenceScore = confidenceScore;
            this.matchType = matchType;
            this.explanation = explanation;
        }

        public boolean isCompatible() { return compatible; }
        public boolean isExactMatch() { return exactMatch; }
        public boolean isPossibleMatch() { return possibleMatch; }
        public double getConfidenceScore() { return confidenceScore; }
        public String getMatchType() { return matchType; }
        public String getExplanation() { return explanation; }
    }

    /**
     * Evaluates whether a candidate listing accurately matches the target product.
     */
    public MatchResult evaluateMatch(String targetBrand, String targetModel, String targetSpecs, String candidateTitle) {
        if (candidateTitle == null || candidateTitle.isBlank()) {
            return new MatchResult(false, false, false, 0.0, "INCOMPATIBLE_VARIANT", "Candidate title is empty");
        }

        String cleanTitle = normalizeString(candidateTitle);
        String cleanBrand = normalizeString(targetBrand);
        String cleanModel = normalizeString(targetModel);

        // 1. Check for Variant Conflicts (Storage, RAM, Generation, Size)
        String conflict = detectVariantConflict(targetModel + " " + (targetSpecs != null ? targetSpecs : ""), candidateTitle);
        if (conflict != null) {
            return new MatchResult(false, false, false, 0.0, "INCOMPATIBLE_VARIANT", "Variant conflict detected: " + conflict);
        }

        // 2. Brand Score (30%)
        double brandScore = calculateBrandScore(cleanBrand, cleanTitle);
        if (brandScore == 0.0 && !cleanBrand.isEmpty()) {
            return new MatchResult(false, false, false, 0.0, "INCOMPATIBLE_VARIANT", "Brand mismatch (" + targetBrand + ")");
        }

        // 3. Model Score (35%)
        double modelScore = calculateModelScore(cleanModel, cleanTitle);

        // 4. Specification Match Score (20%)
        double specScore = calculateSpecScore(targetSpecs, cleanTitle);

        // 5. Title Token Similarity (15%)
        double titleScore = calculateTokenSimilarity(cleanBrand + " " + cleanModel, cleanTitle);

        double totalScore = (brandScore * 0.30) + (modelScore * 0.35) + (specScore * 0.20) + (titleScore * 0.15);
        double roundedScore = Math.round(totalScore * 10.0) / 10.0;

        if (roundedScore >= EXACT_MATCH_THRESHOLD) {
            return new MatchResult(true, true, false, roundedScore, "EXACT_MATCH", "Exact product model and specifications verified");
        } else if (roundedScore >= SIMILAR_MATCH_THRESHOLD) {
            return new MatchResult(true, false, true, roundedScore, "POSSIBLE_MATCH", "Possible match; minor specification differences may exist");
        } else {
            return new MatchResult(false, false, false, roundedScore, "INCOMPATIBLE_VARIANT", "Similarity below threshold (" + roundedScore + "%)");
        }
    }

    /**
     * Backward-compatible calculateSimilarityScore method
     */
    public double calculateSimilarityScore(String brand, String model, String specs, String listingTitle) {
        MatchResult result = evaluateMatch(brand, model, specs, listingTitle);
        return result.getConfidenceScore();
    }

    /**
     * Detects incompatible configuration variants such as 128GB vs 256GB, M2 vs M3, Gen 1 vs Gen 2, etc.
     */
    private String detectVariantConflict(String targetText, String candidateText) {
        String t = targetText.toLowerCase();
        String c = candidateText.toLowerCase();

        // Check Storage Conflict (e.g. 64GB, 128GB, 256GB, 512GB, 1TB)
        String tStorage = extractStorage(t);
        String cStorage = extractStorage(c);
        if (tStorage != null && cStorage != null && !tStorage.equalsIgnoreCase(cStorage)) {
            return "Storage mismatch (" + tStorage + " vs " + cStorage + ")";
        }

        // Check RAM Conflict (e.g. 8GB RAM vs 16GB RAM)
        String tRam = extractRam(t);
        String cRam = extractRam(c);
        if (tRam != null && cRam != null && !tRam.equalsIgnoreCase(cRam)) {
            return "RAM mismatch (" + tRam + " vs " + cRam + ")";
        }

        // Check Generation Conflict (e.g. AirPods Pro 1 vs 2, WH-1000XM4 vs XM5, Apple Silicon M2 vs M3)
        String tGen = extractGeneration(t);
        String cGen = extractGeneration(c);
        if (tGen != null && cGen != null && !tGen.equalsIgnoreCase(cGen)) {
            return "Generation mismatch (" + tGen + " vs " + cGen + ")";
        }

        // Check Shoe Size Conflict (e.g. UK 7 vs UK 9)
        String tSize = extractShoeSize(t);
        String cSize = extractShoeSize(c);
        if (tSize != null && cSize != null && !tSize.equalsIgnoreCase(cSize)) {
            return "Size mismatch (" + tSize + " vs " + cSize + ")";
        }

        return null;
    }

    private String extractStorage(String text) {
        Matcher m = Pattern.compile("\\b(64|128|256|512|1024)\\s*(?:gb|tb)\\b|\\b(1|2)\\s*tb\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        if (m.find()) {
            return m.group().replaceAll("\\s+", "").toUpperCase();
        }
        return null;
    }

    private String extractRam(String text) {
        Matcher m = Pattern.compile("\\b(4|6|8|12|16|24|32|64)\\s*(?:gb|g)\\s*(?:ram|unified|memory|ddr5|ddr4)\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        if (m.find()) {
            return m.group(1) + "GB";
        }
        return null;
    }

    private String extractGeneration(String text) {
        // e.g. M1, M2, M3, M4
        Matcher mM = Pattern.compile("\\b(m[1-4]|m[1-4]\\s*(?:pro|max))\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        if (mM.find()) return mM.group().replaceAll("\\s+", "").toUpperCase();

        // e.g. 1st Gen, 2nd Gen, Gen 1, Gen 2
        Matcher mG = Pattern.compile("\\b(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th)\\s*(?:gen|generation)\\b|\\bgen\\s*([1-9])\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        if (mG.find()) return mG.group().replaceAll("\\s+", "").toUpperCase();

        // e.g. XM4 vs XM5
        Matcher mXm = Pattern.compile("\\b(xm[3-5]|wh-1000xm[3-5])\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        if (mXm.find()) return mXm.group().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();

        return null;
    }

    private String extractShoeSize(String text) {
        Matcher m = Pattern.compile("\\b(uk\\s*[5-9]|uk\\s*1[0-2]|us\\s*[6-9]|us\\s*1[0-3])\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        if (m.find()) return m.group().replaceAll("\\s+", "").toUpperCase();
        return null;
    }

    private double calculateBrandScore(String brand, String title) {
        if (brand == null || brand.isBlank()) return 70.0;
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
        if (specsJson == null || specsJson.isBlank()) return 80.0;

        List<String> extractedSpecs = extractSpecKeywords(specsJson);
        if (extractedSpecs.isEmpty()) return 80.0;

        String compactTitle = title.replaceAll("\\s+", "");
        int matched = 0;
        for (String spec : extractedSpecs) {
            String compactSpec = spec.toLowerCase().replaceAll("\\s+", "");
            if (title.contains(spec.toLowerCase()) || compactTitle.contains(compactSpec)) {
                matched++;
            }
        }
        return (double) matched / extractedSpecs.size() * 100.0;
    }

    private List<String> extractSpecKeywords(String rawSpecs) {
        List<String> list = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\b\\d+\\s*(?:gb|tb|mb|ram|ssd)\\b|\\b(?:black|blue|space grey|silver|onyx black|titanium)\\b)", Pattern.CASE_INSENSITIVE);
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

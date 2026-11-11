package com.pricehunt.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MatchingServiceTest {

    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new MatchingService();
    }

    @Test
    @DisplayName("Should detect phone storage variant mismatch (128 GB vs 256 GB)")
    void testStorageVariantMismatch() {
        MatchingService.MatchResult result = matchingService.evaluateMatch(
                "Apple",
                "iPhone 15",
                "128 GB, Blue",
                "Apple iPhone 15 (256 GB, Blue)"
        );

        assertFalse(result.isCompatible(), "128GB and 256GB models must not be treated as compatible variants");
        assertEquals("INCOMPATIBLE_VARIANT", result.getMatchType());
        assertTrue(result.getExplanation().contains("Storage mismatch"));
    }

    @Test
    @DisplayName("Should detect headphone generation mismatch (WH-1000XM4 vs WH-1000XM5)")
    void testHeadphoneGenerationMismatch() {
        MatchingService.MatchResult result = matchingService.evaluateMatch(
                "Sony",
                "WH-1000XM4",
                "Wireless Noise Cancelling",
                "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones"
        );

        assertFalse(result.isCompatible(), "Different headphone generations (XM4 vs XM5) must not be matched");
        assertEquals("INCOMPATIBLE_VARIANT", result.getMatchType());
        assertTrue(result.getExplanation().contains("Generation mismatch"));
    }

    @Test
    @DisplayName("Should detect laptop processor generation mismatch (M2 vs M3)")
    void testLaptopChipGenerationMismatch() {
        MatchingService.MatchResult result = matchingService.evaluateMatch(
                "Apple",
                "MacBook Air M2",
                "8GB RAM, 256GB SSD",
                "Apple MacBook Air M3 Chip 13.6-inch (8GB RAM, 256GB SSD)"
        );

        assertFalse(result.isCompatible(), "M2 and M3 laptops must not be treated as identical configurations");
        assertEquals("INCOMPATIBLE_VARIANT", result.getMatchType());
        assertTrue(result.getExplanation().contains("Generation mismatch"));
    }

    @Test
    @DisplayName("Should detect laptop RAM mismatch (8GB RAM vs 16GB RAM)")
    void testLaptopRamMismatch() {
        MatchingService.MatchResult result = matchingService.evaluateMatch(
                "Apple",
                "MacBook Air M3",
                "8GB RAM, 256GB SSD",
                "Apple MacBook Air M3 Chip (16GB RAM, 256GB SSD)"
        );

        assertFalse(result.isCompatible(), "8GB and 16GB RAM configurations must not be matched");
        assertEquals("INCOMPATIBLE_VARIANT", result.getMatchType());
        assertTrue(result.getExplanation().contains("RAM mismatch"));
    }

    @Test
    @DisplayName("Should detect shoe size mismatch (UK 8 vs UK 10)")
    void testShoeSizeMismatch() {
        MatchingService.MatchResult result = matchingService.evaluateMatch(
                "Nike",
                "Air Pegasus 40",
                "Running Shoes, Size UK 8",
                "Nike Air Pegasus 40 Men Running Shoes Size UK 10"
        );

        assertFalse(result.isCompatible(), "Different shoe sizes must not be treated as identical variants");
        assertEquals("INCOMPATIBLE_VARIANT", result.getMatchType());
        assertTrue(result.getExplanation().contains("Size mismatch"));
    }

    @Test
    @DisplayName("Should identify exact match with high confidence score")
    void testExactMatch() {
        MatchingService.MatchResult result = matchingService.evaluateMatch(
                "Apple",
                "iPhone 15",
                "128 GB, Blue",
                "Apple iPhone 15 (128 GB, Blue)"
        );

        assertTrue(result.isCompatible());
        assertTrue(result.isExactMatch());
        assertTrue(result.getConfidenceScore() >= 85.0);
        assertEquals("EXACT_MATCH", result.getMatchType());
    }
}


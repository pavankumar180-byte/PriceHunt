package com.pricehunt.controller;

import com.pricehunt.dto.ComparisonResponse;
import com.pricehunt.dto.DealScoreBreakdown;
import com.pricehunt.entity.ProductListing;
import com.pricehunt.repository.ProductListingRepository;
import com.pricehunt.service.ComparisonService;
import com.pricehunt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compare")
public class ComparisonController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ComparisonService comparisonService;

    @Autowired
    private ProductListingRepository productListingRepository;

    @GetMapping("/{productId}")
    public ResponseEntity<ComparisonResponse> compareProduct(
            @PathVariable Long productId,
            @RequestParam(required = false, defaultValue = "best_deal") String sortBy) {
        return ResponseEntity.ok(productService.getProductComparison(productId, sortBy));
    }

    @GetMapping("/score-breakdown/{listingId}")
    public ResponseEntity<DealScoreBreakdown> getScoreBreakdown(@PathVariable Long listingId) {
        ProductListing listing = productListingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));

        Double min = productListingRepository.findMinPriceByProductId(listing.getProduct().getId());
        Double max = productListingRepository.findMaxPriceByProductId(listing.getProduct().getId());

        DealScoreBreakdown breakdown = comparisonService.getDealScoreBreakdown(
                listing, min != null ? min : listing.getPrice().doubleValue(), max != null ? max : listing.getPrice().doubleValue());
        return ResponseEntity.ok(breakdown);
    }
}

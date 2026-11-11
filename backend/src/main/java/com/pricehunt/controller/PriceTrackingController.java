package com.pricehunt.controller;

import com.pricehunt.dto.PriceHistory30DayDto;
import com.pricehunt.entity.TrackedProduct;
import com.pricehunt.entity.User;
import com.pricehunt.service.PriceTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/track")
public class PriceTrackingController {

    @Autowired
    private PriceTrackingService priceTrackingService;

    /**
     * Toggles 24-hour automated monitoring for a product.
     */
    @PostMapping("/toggle/{productId}")
    public ResponseEntity<?> toggleTracking(@PathVariable Long productId) {
        try {
            TrackedProduct tp = priceTrackingService.toggleTracking(productId, null);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "productId", productId,
                    "trackingEnabled", tp.getTrackingEnabled(),
                    "status", tp.getStatus(),
                    "lastCheckedAt", tp.getLastCheckedAt(),
                    "nextCheckAt", tp.getNextCheckAt(),
                    "dataSource", tp.getDataSource(),
                    "message", tp.getTrackingEnabled() ? "Automated 24-hour price monitoring enabled." : "Price tracking paused."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Retrieves genuine historical price data for the previous 30 days.
     * Contains only authentic stored snapshots; zero fabricated records.
     */
    @GetMapping("/history-30d/{productId}")
    public ResponseEntity<PriceHistory30DayDto> get30DayHistory(@PathVariable Long productId) {
        return ResponseEntity.ok(priceTrackingService.get30DayHistory(productId));
    }

    /**
     * Gets tracking status metadata for a product.
     */
    @GetMapping("/status/{productId}")
    public ResponseEntity<?> getTrackingStatus(@PathVariable Long productId) {
        return priceTrackingService.getTrackedProduct(productId)
                .map(tp -> ResponseEntity.ok((Object) Map.of(
                        "tracked", true,
                        "trackingEnabled", tp.getTrackingEnabled(),
                        "status", tp.getStatus(),
                        "lastCheckedAt", tp.getLastCheckedAt(),
                        "nextCheckAt", tp.getNextCheckAt(),
                        "dataSource", tp.getDataSource(),
                        "currentPrice", tp.getCurrentPrice(),
                        "initialPrice", tp.getInitialPrice()
                )))
                .orElse(ResponseEntity.ok(Map.of(
                        "tracked", false,
                        "trackingEnabled", false,
                        "status", "NOT_TRACKED"
                )));
    }

    /**
     * Manually triggers a real-time price snapshot refresh for a product.
     */
    @PostMapping("/refresh/{productId}")
    public ResponseEntity<PriceHistory30DayDto> refreshPriceSnapshot(@PathVariable Long productId) {
        return ResponseEntity.ok(priceTrackingService.refreshProductPrices(productId));
    }
}


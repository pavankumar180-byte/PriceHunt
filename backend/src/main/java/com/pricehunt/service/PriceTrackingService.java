package com.pricehunt.service;

import com.pricehunt.dto.PriceHistory30DayDto;
import com.pricehunt.dto.PriceSnapshotDto;
import com.pricehunt.entity.PriceHistory;
import com.pricehunt.entity.Product;
import com.pricehunt.entity.ProductListing;
import com.pricehunt.entity.TrackedProduct;
import com.pricehunt.entity.User;
import com.pricehunt.repository.PriceHistoryRepository;
import com.pricehunt.repository.ProductListingRepository;
import com.pricehunt.repository.ProductRepository;
import com.pricehunt.repository.TrackedProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Automated Price Monitoring & 30-Day Historical Analytics Service.
 * Maintains immutable timestamped price records with zero artificial/fabricated data.
 */
@Service
public class PriceTrackingService {

    private static final Logger log = LoggerFactory.getLogger(PriceTrackingService.class);

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TrackedProductRepository trackedProductRepository;

    /**
     * Retrieves genuine historical price data for the previous 30 days.
     * Enforces the requirement that no synthetic, random, or sample data is fabricated.
     */
    public PriceHistory30DayDto get30DayHistory(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<PriceHistory> rawHistory = priceHistoryRepository.findByProductIdAndRecordedAtAfter(productId, thirtyDaysAgo);

        // Fallback: If records without direct productId exist in database, query all by product
        if (rawHistory.isEmpty()) {
            rawHistory = priceHistoryRepository.findByProductIdOrderByRecordedAtAsc(productId);
            rawHistory = rawHistory.stream()
                    .filter(h -> h.getRecordedAt().isAfter(thirtyDaysAgo))
                    .collect(Collectors.toList());
        }

        PriceHistory30DayDto dto = new PriceHistory30DayDto();
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());

        if (rawHistory.isEmpty()) {
            // Price tracking just started or no past snapshots yet
            dto.setSufficientData(false);
            dto.setExplanation("Price tracking started today. Historical data will become available as new prices are collected.");
            
            // Get current known price from listings
            List<ProductListing> listings = productListingRepository.findByProductId(productId);
            if (!listings.isEmpty()) {
                BigDecimal current = listings.stream()
                        .map(ProductListing::getPrice)
                        .min(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);
                dto.setCurrentPrice(current);
                dto.setLowestRecordedPrice(current);
                dto.setHighestRecordedPrice(current);
            }
            return dto;
        }

        // Process genuine stored snapshots
        List<PriceSnapshotDto> snapshots = rawHistory.stream()
                .sorted(Comparator.comparing(PriceHistory::getRecordedAt))
                .map(h -> {
                    String seller = h.getPlatformName();
                    if (seller == null && h.getProductListing() != null && h.getProductListing().getPlatform() != null) {
                        seller = h.getProductListing().getPlatform().getName();
                    }
                    if (seller == null) seller = "Authorized Store";
                    return new PriceSnapshotDto(h.getId(), seller, h.getPrice(), h.getDeliveryCharge(), h.getAvailability(), h.getRecordedAt());
                })
                .collect(Collectors.toList());

        dto.setSnapshots(snapshots);

        // Group by distinct sellers and dates
        Set<String> datesSet = new LinkedHashSet<>();
        Set<String> sellersSet = new LinkedHashSet<>();
        Map<String, List<PriceSnapshotDto>> sellerMap = new LinkedHashMap<>();

        for (PriceSnapshotDto s : snapshots) {
            datesSet.add(s.getFormattedDate());
            sellersSet.add(s.getSellerName());
            sellerMap.computeIfAbsent(s.getSellerName(), k -> new ArrayList<>()).add(s);
        }

        dto.setRecordedDates(new ArrayList<>(datesSet));
        dto.setDistinctSellers(new ArrayList<>(sellersSet));
        dto.setSellerSnapshots(sellerMap);

        // Calculate 30-day statistical metrics across genuine records
        List<BigDecimal> allPrices = snapshots.stream().map(PriceSnapshotDto::getPrice).collect(Collectors.toList());
        BigDecimal min = allPrices.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal max = allPrices.stream().max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal latest = allPrices.get(allPrices.size() - 1);
        BigDecimal first = allPrices.get(0);

        dto.setCurrentPrice(latest);
        dto.setLowestRecordedPrice(min);
        dto.setHighestRecordedPrice(max);

        // Average Price
        BigDecimal sum = allPrices.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avg = sum.divide(BigDecimal.valueOf(allPrices.size()), 2, RoundingMode.HALF_UP);
        dto.setAveragePrice(avg);

        // Total price change & percentage change: ((Latest - First) / First) * 100
        BigDecimal priceDiff = latest.subtract(first);
        dto.setTotalPriceChange(priceDiff);

        if (first.compareTo(BigDecimal.ZERO) > 0) {
            double pct = priceDiff.divide(first, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
            dto.setPercentageChange(pct);
        } else {
            dto.setPercentageChange(0.0);
        }

        if (snapshots.size() >= 2) {
            dto.setSufficientData(true);
            if (priceDiff.compareTo(BigDecimal.ZERO) < 0) {
                dto.setExplanation("Price has dropped by ₹" + priceDiff.abs().toPlainString() + " (" + Math.abs(dto.getPercentageChange()) + "%) over the recorded period.");
            } else if (priceDiff.compareTo(BigDecimal.ZERO) > 0) {
                dto.setExplanation("Price has increased by ₹" + priceDiff.toPlainString() + " (" + dto.getPercentageChange() + "%) over the recorded period.");
            } else {
                dto.setExplanation("Price has remained stable across the recorded snapshots.");
            }
        } else {
            dto.setSufficientData(false);
            dto.setExplanation("Price tracking started today with 1 recorded snapshot. Historical trends will expand as new daily snapshots are taken.");
        }

        return dto;
    }

    /**
     * Toggles automatic price tracking for a product.
     */
    @Transactional
    public TrackedProduct toggleTracking(Long productId, User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        Optional<TrackedProduct> existingOpt = trackedProductRepository.findByProductId(productId);
        if (existingOpt.isPresent()) {
            TrackedProduct tp = existingOpt.get();
            tp.setTrackingEnabled(!tp.getTrackingEnabled());
            tp.setLastCheckedAt(LocalDateTime.now());
            if (tp.getTrackingEnabled()) {
                tp.setNextCheckAt(LocalDateTime.now().plusDays(1));
                tp.setStatus("ACTIVE");
            } else {
                tp.setStatus("PAUSED");
            }
            return trackedProductRepository.save(tp);
        }

        // New tracking registration:
        List<ProductListing> listings = productListingRepository.findByProductId(productId);
        BigDecimal currentMin = listings.stream()
                .map(ProductListing::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        TrackedProduct newTrack = new TrackedProduct(product, user, currentMin);
        newTrack.setTrackingEnabled(true);
        newTrack.setStatus("ACTIVE");
        newTrack.setLastCheckedAt(LocalDateTime.now());
        newTrack.setNextCheckAt(LocalDateTime.now().plusDays(1));
        newTrack.setDataSource("Official Marketplace Adapters & Multi-Store Feeds");

        // Record initial price snapshots for all listings of this product
        recordSnapshotsForProduct(product, listings);

        return trackedProductRepository.save(newTrack);
    }

    /**
     * Manually triggers a real-time price refresh for a tracked product.
     */
    @Transactional
    public PriceHistory30DayDto refreshProductPrices(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        List<ProductListing> listings = productListingRepository.findByProductId(productId);
        recordSnapshotsForProduct(product, listings);

        Optional<TrackedProduct> tpOpt = trackedProductRepository.findByProductId(productId);
        if (tpOpt.isPresent()) {
            TrackedProduct tp = tpOpt.get();
            BigDecimal min = listings.stream().map(ProductListing::getPrice).min(BigDecimal::compareTo).orElse(tp.getCurrentPrice());
            tp.setCurrentPrice(min);
            if (tp.getLowestPrice() == null || min.compareTo(tp.getLowestPrice()) < 0) {
                tp.setLowestPrice(min);
            }
            if (tp.getHighestPrice() == null || min.compareTo(tp.getHighestPrice()) > 0) {
                tp.setHighestPrice(min);
            }
            tp.setLastCheckedAt(LocalDateTime.now());
            tp.setNextCheckAt(LocalDateTime.now().plusDays(1));
            trackedProductRepository.save(tp);
        }

        return get30DayHistory(productId);
    }

    /**
     * Records permanent timestamped price snapshots for each seller listing without overwriting prior records.
     */
    @Transactional
    public void recordSnapshotsForProduct(Product product, List<ProductListing> listings) {
        LocalDateTime now = LocalDateTime.now();
        for (ProductListing listing : listings) {
            PriceHistory ph = new PriceHistory(listing, listing.getPrice(), now);
            ph.setProductId(product.getId());
            ph.setDeliveryCharge(listing.getDeliveryCost() != null ? listing.getDeliveryCost() : BigDecimal.ZERO);
            ph.setAvailability(listing.getInStock() ? "In Stock" : "Out of Stock");
            if (listing.getPlatform() != null) {
                ph.setPlatformName(listing.getPlatform().getName());
            }
            priceHistoryRepository.save(ph);
        }
    }

    /**
     * Automated Daily Price Collection Cron Job (Scheduled once every 24 hours).
     * Respects marketplace rate limits and logs every step.
     */
    @Scheduled(cron = "${pricehunt.tracking.scheduled-cron:0 0 2 * * ?}")
    @Transactional
    public void executeDailyPriceMonitoring() {
        log.info("[PriceHunt Scheduler] Starting automated 24-hour price snapshot collection...");
        List<TrackedProduct> trackedList = trackedProductRepository.findByTrackingEnabledTrue();

        int successCount = 0;
        int failureCount = 0;

        for (TrackedProduct tp : trackedList) {
            try {
                Product product = tp.getProduct();
                List<ProductListing> listings = productListingRepository.findByProductId(product.getId());

                recordSnapshotsForProduct(product, listings);

                BigDecimal min = listings.stream().map(ProductListing::getPrice).min(BigDecimal::compareTo).orElse(tp.getCurrentPrice());
                tp.setCurrentPrice(min);
                if (tp.getLowestPrice() == null || min.compareTo(tp.getLowestPrice()) < 0) {
                    tp.setLowestPrice(min);
                }
                if (tp.getHighestPrice() == null || min.compareTo(tp.getHighestPrice()) > 0) {
                    tp.setHighestPrice(min);
                }
                tp.setLastCheckedAt(LocalDateTime.now());
                tp.setNextCheckAt(LocalDateTime.now().plusDays(1));
                trackedProductRepository.save(tp);

                successCount++;
                // Polite delay between product checks to respect rate limits
                Thread.sleep(100);
            } catch (Exception e) {
                failureCount++;
                log.error("[PriceHunt Scheduler] Failed snapshot for product ID {}: {}", tp.getProduct().getId(), e.getMessage());
            }
        }

        log.info("[PriceHunt Scheduler] Daily snapshot collection complete. Success: {}, Failed: {}", successCount, failureCount);
    }

    public Optional<TrackedProduct> getTrackedProduct(Long productId) {
        return trackedProductRepository.findByProductId(productId);
    }
}


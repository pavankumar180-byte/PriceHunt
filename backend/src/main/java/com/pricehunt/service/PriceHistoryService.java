package com.pricehunt.service;

import com.pricehunt.dto.PriceHistoryDto;
import com.pricehunt.entity.PriceHistory;
import com.pricehunt.entity.ProductListing;
import com.pricehunt.repository.PriceHistoryRepository;
import com.pricehunt.repository.ProductListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PriceHistoryService {

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    public List<PriceHistoryDto> getHistoryForProduct(Long productId) {
        return priceHistoryRepository.findByProductIdOrderByRecordedAtAsc(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PriceHistoryDto> getHistoryForListing(Long listingId) {
        return priceHistoryRepository.findByProductListingIdOrderByRecordedAtAsc(listingId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PriceHistory logPriceChange(Long listingId, BigDecimal newPrice) {
        ProductListing listing = productListingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));

        listing.setPrice(newPrice);
        listing.setUpdatedAt(LocalDateTime.now());
        productListingRepository.save(listing);

        PriceHistory history = new PriceHistory(listing, newPrice, LocalDateTime.now());
        return priceHistoryRepository.save(history);
    }

    private PriceHistoryDto mapToDto(PriceHistory h) {
        String platform = h.getProductListing() != null && h.getProductListing().getPlatform() != null
                ? h.getProductListing().getPlatform().getName() : "Store";
        return new PriceHistoryDto(h.getId(), h.getProductListing().getId(), platform, h.getPrice(), h.getRecordedAt());
    }
}

package com.pricehunt.service;

import com.pricehunt.dto.ComparisonResponse;
import com.pricehunt.dto.ListingDto;
import com.pricehunt.dto.ProductResponse;
import com.pricehunt.entity.Product;
import com.pricehunt.entity.ProductListing;
import com.pricehunt.repository.ProductListingRepository;
import com.pricehunt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    @Autowired
    private ComparisonService comparisonService;

    @Autowired
    private MatchingService matchingService;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public Optional<ProductResponse> getProductById(Long id) {
        return productRepository.findById(id).map(this::mapToProductResponse);
    }

    public List<ProductResponse> searchProducts(String query, String category, String brand, BigDecimal minPrice, BigDecimal maxPrice, String sortBy) {
        List<Product> products;

        if (query != null && !query.trim().isEmpty()) {
            String cleanQuery = query.trim();
            products = productRepository.searchProducts(cleanQuery);

            // If strict search yields few results, attempt fuzzy matching across titles
            if (products.isEmpty()) {
                List<ProductListing> matchedListings = productListingRepository.searchByTitle(cleanQuery);
                Set<Long> productIds = matchedListings.stream()
                        .map(l -> l.getProduct().getId())
                        .collect(Collectors.toSet());
                products = productRepository.findAllById(productIds);
            }
        } else {
            products = productRepository.findAll();
        }

        // Apply In-Memory Multi-Facet Filters
        return products.stream()
                .filter(p -> category == null || category.isBlank() || p.getCategory().equalsIgnoreCase(category.trim()))
                .filter(p -> brand == null || brand.isBlank() || p.getBrand().equalsIgnoreCase(brand.trim()))
                .map(this::mapToProductResponse)
                .filter(p -> minPrice == null || (p.getMinPrice() != null && p.getMinPrice().compareTo(minPrice) >= 0))
                .filter(p -> maxPrice == null || (p.getMinPrice() != null && p.getMinPrice().compareTo(maxPrice) <= 0))
                .sorted((p1, p2) -> applySorting(p1, p2, sortBy))
                .collect(Collectors.toList());
    }

    public ComparisonResponse getProductComparison(Long productId, String sortBy) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        List<ProductListing> rawListings = productListingRepository.findByProductId(productId);
        List<ListingDto> rankedListings = comparisonService.rankAndScoreListings(rawListings, sortBy);

        ProductResponse productDto = mapToProductResponse(product);
        productDto.setListings(rankedListings);

        ComparisonResponse response = new ComparisonResponse();
        response.setProduct(productDto);
        response.setRankedListings(rankedListings);

        // Extract special deals
        rankedListings.stream().filter(ListingDto::getIsBestPrice).findFirst().ifPresent(response::setLowestPriceDeal);
        rankedListings.stream().filter(ListingDto::getIsBestDeal).findFirst().ifPresent(response::setBestValueDeal);
        rankedListings.stream().min(Comparator.comparing(ListingDto::getDeliveryDays)).ifPresent(response::setFastestDeliveryDeal);

        // Find Similar Products in same category via Matching Algorithm
        List<ProductResponse> similar = productRepository.findByCategoryIgnoreCase(product.getCategory()).stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(4)
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
        response.setSimilarProducts(similar);

        return response;
    }

    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    public List<String> getBrands() {
        return productRepository.findDistinctBrands();
    }

    public ProductResponse mapToProductResponse(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setModel(product.getModel());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());
        dto.setSpecsJson(product.getSpecsJson());

        List<ProductListing> listings = productListingRepository.findByProductId(product.getId());
        dto.setListingCount(listings.size());

        if (!listings.isEmpty()) {
            List<ListingDto> listingDtos = comparisonService.rankAndScoreListings(listings, "best_deal");
            dto.setListings(listingDtos);

            BigDecimal min = listings.stream().map(ProductListing::getPrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            BigDecimal max = listings.stream().map(ProductListing::getPrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            double maxDisc = listings.stream().mapToDouble(ProductListing::getDiscountPercentage).max().orElse(0.0);
            double bestRat = listings.stream().mapToDouble(ProductListing::getRating).max().orElse(4.0);

            dto.setMinPrice(min);
            dto.setMaxPrice(max);
            dto.setMaxDiscount(maxDisc);
            dto.setBestRating(bestRat);

            listingDtos.stream().filter(ListingDto::getIsBestPrice).findFirst().ifPresent(dto::setBestPriceListing);
            listingDtos.stream().filter(ListingDto::getIsBestDeal).findFirst().ifPresent(dto::setBestDealListing);
        }

        return dto;
    }

    private int applySorting(ProductResponse p1, ProductResponse p2, String sortBy) {
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            BigDecimal price1 = p1.getMinPrice() != null ? p1.getMinPrice() : BigDecimal.ZERO;
            BigDecimal price2 = p2.getMinPrice() != null ? p2.getMinPrice() : BigDecimal.ZERO;
            return price1.compareTo(price2);
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            BigDecimal price1 = p1.getMinPrice() != null ? p1.getMinPrice() : BigDecimal.ZERO;
            BigDecimal price2 = p2.getMinPrice() != null ? p2.getMinPrice() : BigDecimal.ZERO;
            return price2.compareTo(price1);
        } else if ("rating_desc".equalsIgnoreCase(sortBy)) {
            Double r1 = p1.getBestRating() != null ? p1.getBestRating() : 0.0;
            Double r2 = p2.getBestRating() != null ? p2.getBestRating() : 0.0;
            return r2.compareTo(r1);
        } else if ("discount_desc".equalsIgnoreCase(sortBy)) {
            Double d1 = p1.getMaxDiscount() != null ? p1.getMaxDiscount() : 0.0;
            Double d2 = p2.getMaxDiscount() != null ? p2.getMaxDiscount() : 0.0;
            return d2.compareTo(d1);
        }
        return p1.getId().compareTo(p2.getId());
    }
}

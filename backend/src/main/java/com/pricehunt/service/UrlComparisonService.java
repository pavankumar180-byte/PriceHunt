package com.pricehunt.service;

import com.pricehunt.dto.OfferComparisonDto;
import com.pricehunt.dto.ProductResponse;
import com.pricehunt.dto.UrlComparisonResponse;
import com.pricehunt.entity.Platform;
import com.pricehunt.entity.Product;
import com.pricehunt.entity.ProductListing;
import com.pricehunt.integration.marketplace.*;
import com.pricehunt.repository.PlatformRepository;
import com.pricehunt.repository.ProductListingRepository;
import com.pricehunt.repository.ProductRepository;
import com.pricehunt.repository.TrackedProductRepository;
import com.pricehunt.security.UrlSecurityValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UrlComparisonService {

    private static final Logger log = LoggerFactory.getLogger(UrlComparisonService.class);

    @Autowired
    private UrlSecurityValidator securityValidator;

    @Autowired
    private MarketplaceRegistry marketplaceRegistry;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private TrackedProductRepository trackedProductRepository;

    public UrlComparisonResponse compareProductUrl(String rawUrl) {
        UrlComparisonResponse response = new UrlComparisonResponse();
        response.setInputUrl(rawUrl);

        // 1. Security Validation & Normalization
        URI uri;
        try {
            uri = securityValidator.validateAndNormalizeUrl(rawUrl);
        } catch (IllegalArgumentException | SecurityException e) {
            response.setSuccess(false);
            response.setMessage("URL validation failed: " + e.getMessage());
            return response;
        }

        String domain = securityValidator.extractNormalizedDomain(rawUrl);
        response.setDetectedDomain(domain);

        // 2. Identify Marketplace Adapter
        Optional<MarketplaceAdapter> adapterOpt = marketplaceRegistry.findAdapterForDomain(domain);
        if (adapterOpt.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Unsupported e-commerce marketplace: '" + domain + "'. Supported platforms: Amazon India, Flipkart, Croma, Reliance Digital, Myntra.");
            return response;
        }

        MarketplaceAdapter primaryAdapter = adapterOpt.get();
        response.setSourceMarketplaceStatus(primaryAdapter.getStatus());

        // 3. Extract Unique Product Identifier (ASIN, PID, SKU, etc.)
        String identifier = primaryAdapter.extractIdentifier(rawUrl);
        response.setProductIdentifier(identifier);

        // 4. Extract Product Details from Adapter / Authorized Catalog
        Optional<ExtractedProductInfo> extractedOpt = primaryAdapter.extractProduct(rawUrl, identifier);

        Product canonicalProduct = null;
        if (extractedOpt.isPresent()) {
            ExtractedProductInfo extracted = extractedOpt.get();
            // Lookup or resolve canonical Product in database
            canonicalProduct = resolveCanonicalProduct(extracted, identifier);
        } else if (identifier != null) {
            // Check if existing product in DB has this identifier
            Optional<Product> dbProd = productRepository.findByProductIdentifier(identifier);
            if (dbProd.isPresent()) {
                canonicalProduct = dbProd.get();
            }
        }

        if (canonicalProduct == null) {
            Optional<ProductListing> directListing = productListingRepository.findFirstByProductUrlContaining(rawUrl);
            if (directListing.isPresent() && directListing.get().getProduct() != null) {
                canonicalProduct = directListing.get().getProduct();
            }
        }

        if (canonicalProduct == null) {
            // Attempt smart URL part search
            canonicalProduct = findProductByUrlKeyword(rawUrl);
        }

        if (canonicalProduct == null) {
            response.setSuccess(false);
            response.setMessage("Product could not be identified from this link (" + rawUrl + "). Please verify that the link points directly to a valid product page.");
            return response;
        }

        // 5. Build canonical Product Response DTO
        ProductResponse productDto = productService.mapToProductResponse(canonicalProduct);
        response.setProduct(productDto);

        // 6. Gather Multi-Store Offers across all supported platforms
        List<OfferComparisonDto> offers = gatherVerifiedOffers(canonicalProduct, primaryAdapter, rawUrl, extractedOpt.orElse(null));

        if (offers.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Found product '" + canonicalProduct.getName() + "', but no verified seller offers were currently accessible.");
            return response;
        }

        // 7. Calculate Total Cost = Price + Delivery & Highlight Lowest
        evaluateTotalCostAndBestPrice(offers);

        // 8. Calculate Lowest, Highest, Price Difference, and Potential Savings
        calculatePriceMetrics(offers, response);

        response.setOffers(offers);
        response.setSuccess(true);
        response.setMessage("Successfully matched product across supported marketplaces.");

        // Check tracking state
        boolean isTracked = trackedProductRepository.existsByProductId(canonicalProduct.getId());
        response.setTrackingActive(isTracked);

        return response;
    }

    private Product resolveCanonicalProduct(ExtractedProductInfo info, String identifier) {
        if (info != null && info.getCanonicalProductId() != null) {
            Optional<Product> direct = productRepository.findById(info.getCanonicalProductId());
            if (direct.isPresent()) return direct.get();
        }

        if (identifier != null) {
            Optional<Product> existing = productRepository.findByProductIdentifier(identifier);
            if (existing.isPresent()) return existing.get();

            List<ProductListing> byListingCode = productListingRepository.findByProductIdentifier(identifier);
            if (!byListingCode.isEmpty() && byListingCode.get(0).getProduct() != null) {
                return byListingCode.get(0).getProduct();
            }
        }

        if (info == null) return null;

        // Check by model or title similarity
        if (info.getModel() != null && !info.getModel().isBlank()) {
            List<Product> byModel = productRepository.searchProducts(info.getModel());
            if (!byModel.isEmpty()) {
                for (Product p : byModel) {
                    MatchingService.MatchResult m = matchingService.evaluateMatch(p.getBrand(), p.getModel(), p.getSpecsJson(), info.getProductName());
                    if (m.isExactMatch()) {
                        return p;
                    }
                }
            }
        }

        // Check by name keywords
        List<Product> keywordMatches = productRepository.searchProducts(info.getProductName());
        if (!keywordMatches.isEmpty()) {
            return keywordMatches.get(0);
        }

        return null;
    }

    private Product findProductByUrlKeyword(String url) {
        try {
            URI u = new URI(url);
            String target = ((u.getPath() != null ? u.getPath() : "") + " " + (u.getQuery() != null ? u.getQuery() : "")).toLowerCase();
            target = java.net.URLDecoder.decode(target, java.nio.charset.StandardCharsets.UTF_8);

            // Extract query param directly if present (e.g. k=..., q=..., text=...)
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("[?&](?:q|k|text)=([^&]+)", java.util.regex.Pattern.CASE_INSENSITIVE).matcher(url);
            if (m.find()) {
                String term = java.net.URLDecoder.decode(m.group(1).replace("+", " "), java.nio.charset.StandardCharsets.UTF_8).trim();
                List<Product> directMatches = productRepository.searchProducts(term);
                if (!directMatches.isEmpty()) return directMatches.get(0);
            }

            String[] segments = target.split("[/\\-_?&=+\\s]+");
            for (String seg : segments) {
                if (seg.length() >= 4 && !seg.matches("^(product|item|dp|goods|html|php|search|text|true|false)$")) {
                    List<Product> found = productRepository.searchProducts(seg);
                    if (!found.isEmpty()) return found.get(0);
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private List<OfferComparisonDto> gatherVerifiedOffers(Product product, MarketplaceAdapter sourceAdapter, String inputUrl, ExtractedProductInfo sourceExtracted) {
        List<OfferComparisonDto> offers = new ArrayList<>();
        Set<String> processedSellers = new HashSet<>();

        // A. If source adapter produced extracted info, add it
        if (sourceExtracted != null) {
            OfferComparisonDto sourceOffer = mapExtractedToOffer(sourceExtracted, sourceAdapter);
            offers.add(sourceOffer);
            processedSellers.add(sourceOffer.getSellerName().toLowerCase());
        }

        // B. Query existing stored listings in PriceHunt database for this product
        List<ProductListing> dbListings = productListingRepository.findByProductId(product.getId());
        for (ProductListing listing : dbListings) {
            Platform plat = listing.getPlatform();
            String storeName = plat != null ? plat.getName() : listing.getSellerName();
            if (storeName == null) storeName = "Store";

            // If this store was already added from direct input, avoid duplicate
            if (processedSellers.contains(storeName.toLowerCase())) {
                continue;
            }

            // Verify variant compatibility
            MatchingService.MatchResult matchResult = matchingService.evaluateMatch(
                    product.getBrand(), product.getModel(), product.getSpecsJson(), listing.getTitle());

            if (!matchResult.isCompatible()) {
                log.info("Discarding listing '{}' due to variant mismatch: {}", listing.getTitle(), matchResult.getExplanation());
                continue;
            }

            OfferComparisonDto offer = new OfferComparisonDto();
            offer.setId(listing.getId());
            offer.setSellerName(storeName);
            offer.setSellerWebsite(plat != null ? plat.getWebsiteUrl() : listing.getProductUrl());
            offer.setDomain(plat != null ? plat.getDomain() : "store.com");
            offer.setPlatformLogo(plat != null ? plat.getLogoUrl() : "🏬");
            offer.setProductName(listing.getTitle());
            offer.setProductUrl(listing.getProductUrl());
            offer.setImageUrl(product.getImageUrl());
            offer.setSellingPrice(listing.getPrice());
            offer.setOriginalPrice(listing.getOriginalPrice());
            offer.setDiscountPercentage(listing.getDiscountPercentage());
            offer.setDeliveryCharge(listing.getDeliveryCost() != null ? listing.getDeliveryCost() : BigDecimal.ZERO);
            offer.setDeliveryChargeKnown(true);
            offer.setAvailability(listing.getInStock() ? "In Stock" : "Out of Stock");
            offer.setLastUpdated(listing.getUpdatedAt() != null ? listing.getUpdatedAt() : LocalDateTime.now());
            offer.setMatchType(matchResult.getMatchType());
            offer.setMatchConfidence(matchResult.getConfidenceScore());
            offer.setSourceType(listing.getSourceType() != null ? listing.getSourceType() : "VERIFIED_CATALOG");

            offers.add(offer);
            processedSellers.add(storeName.toLowerCase());
        }

        // C. Check other active marketplace adapters for matching offers
        for (MarketplaceAdapter adapter : marketplaceRegistry.getAllAdapters()) {
            if (processedSellers.contains(adapter.getPlatformName().toLowerCase())) {
                continue;
            }

            try {
                Optional<ExtractedProductInfo> offerOpt = adapter.searchMatchingOffer(product);
                if (offerOpt.isPresent()) {
                    OfferComparisonDto offer = mapExtractedToOffer(offerOpt.get(), adapter);
                    offers.add(offer);
                    processedSellers.add(adapter.getPlatformName().toLowerCase());
                }
            } catch (Exception e) {
                log.warn("Error querying adapter {}: {}", adapter.getPlatformName(), e.getMessage());
            }
        }

        return offers;
    }

    private OfferComparisonDto mapExtractedToOffer(ExtractedProductInfo info, MarketplaceAdapter adapter) {
        OfferComparisonDto dto = new OfferComparisonDto();
        dto.setSellerName(adapter != null ? adapter.getPlatformName() : info.getSellerName());
        dto.setSellerWebsite(info.getSellerWebsite() != null ? info.getSellerWebsite() : "https://" + info.getDomain());
        dto.setDomain(info.getDomain());
        dto.setPlatformLogo(getPlatformLogo(dto.getSellerName()));
        dto.setProductName(info.getProductName());
        dto.setProductUrl(info.getProductUrl());
        dto.setImageUrl(info.getImageUrl());
        dto.setSellingPrice(info.getSellingPrice());
        dto.setOriginalPrice(info.getOriginalPrice());
        dto.setDiscountPercentage(info.getDiscountPercentage());
        dto.setDeliveryCharge(info.getDeliveryCharge() != null ? info.getDeliveryCharge() : BigDecimal.ZERO);
        dto.setDeliveryChargeKnown(info.isDeliveryChargeKnown());
        dto.setAvailability(info.getAvailability() != null ? info.getAvailability() : "In Stock");
        dto.setLastUpdated(LocalDateTime.now());
        dto.setMatchType(info.getMatchType() != null ? info.getMatchType() : "EXACT_MATCH");
        dto.setMatchConfidence(info.getMatchConfidence() != null ? info.getMatchConfidence() : 100.0);
        dto.setSourceType(info.getSourceType() != null ? info.getSourceType() : "VERIFIED_CATALOG");
        return dto;
    }

    private void evaluateTotalCostAndBestPrice(List<OfferComparisonDto> offers) {
        if (offers == null || offers.isEmpty()) return;

        // Calculate Total Cost = Selling Price + Delivery Cost
        for (OfferComparisonDto o : offers) {
            BigDecimal delivery = (o.isDeliveryChargeKnown() && o.getDeliveryCharge() != null) ? o.getDeliveryCharge() : BigDecimal.ZERO;
            if (o.getSellingPrice() != null) {
                o.setTotalCost(o.getSellingPrice().add(delivery));
            }
        }

        // Sort by total cost ascending
        offers.sort(Comparator.comparing(OfferComparisonDto::getTotalCost));

        // Mark BEST PRICE on the lowest verified comparable offer
        offers.forEach(o -> o.setIsBestPrice(false));
        offers.get(0).setIsBestPrice(true);
    }

    private void calculatePriceMetrics(List<OfferComparisonDto> offers, UrlComparisonResponse response) {
        if (offers.isEmpty()) return;

        BigDecimal min = offers.stream().map(OfferComparisonDto::getSellingPrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal max = offers.stream().map(OfferComparisonDto::getSellingPrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);

        response.setLowestPrice(min);
        response.setHighestPrice(max);

        BigDecimal diff = max.subtract(min);
        response.setPriceDifference(diff);
        response.setMaxPotentialSavings(diff);

        if (max.compareTo(BigDecimal.ZERO) > 0) {
            double pct = diff.divide(max, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
            response.setSavingsPercentage(pct);
        } else {
            response.setSavingsPercentage(0.0);
        }

        response.setBestPriceOffer(offers.get(0));
    }

    private String getPlatformLogo(String sellerName) {
        if (sellerName == null) return "🏬";
        String s = sellerName.toLowerCase();
        if (s.contains("amazon")) return "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
        if (s.contains("flipkart")) return "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png";
        if (s.contains("croma")) return "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg";
        if (s.contains("reliance")) return "https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg";
        if (s.contains("myntra")) return "https://images.indianexpress.com/2021/01/myntra.png";
        return "🏬";
    }
}

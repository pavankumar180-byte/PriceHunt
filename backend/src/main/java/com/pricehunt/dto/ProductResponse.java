package com.pricehunt.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String model;
    private String category;
    private String imageUrl;
    private String description;
    private String specsJson;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double maxDiscount;
    private Integer listingCount;
    private Double bestRating;
    private List<ListingDto> listings;
    private ListingDto bestPriceListing;
    private ListingDto bestDealListing;

    public ProductResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSpecsJson() { return specsJson; }
    public void setSpecsJson(String specsJson) { this.specsJson = specsJson; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public Double getMaxDiscount() { return maxDiscount; }
    public void setMaxDiscount(Double maxDiscount) { this.maxDiscount = maxDiscount; }

    public Integer getListingCount() { return listingCount; }
    public void setListingCount(Integer listingCount) { this.listingCount = listingCount; }

    public Double getBestRating() { return bestRating; }
    public void setBestRating(Double bestRating) { this.bestRating = bestRating; }

    public List<ListingDto> getListings() { return listings; }
    public void setListings(List<ListingDto> listings) { this.listings = listings; }

    public ListingDto getBestPriceListing() { return bestPriceListing; }
    public void setBestPriceListing(ListingDto bestPriceListing) { this.bestPriceListing = bestPriceListing; }

    public ListingDto getBestDealListing() { return bestDealListing; }
    public void setBestDealListing(ListingDto bestDealListing) { this.bestDealListing = bestDealListing; }
}

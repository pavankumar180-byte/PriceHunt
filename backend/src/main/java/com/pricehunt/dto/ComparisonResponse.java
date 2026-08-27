package com.pricehunt.dto;

import java.util.List;

public class ComparisonResponse {
    private ProductResponse product;
    private List<ListingDto> rankedListings;
    private ListingDto lowestPriceDeal;
    private ListingDto bestValueDeal;
    private ListingDto fastestDeliveryDeal;
    private List<ProductResponse> similarProducts;

    public ComparisonResponse() {}

    public ProductResponse getProduct() { return product; }
    public void setProduct(ProductResponse product) { this.product = product; }

    public List<ListingDto> getRankedListings() { return rankedListings; }
    public void setRankedListings(List<ListingDto> rankedListings) { this.rankedListings = rankedListings; }

    public ListingDto getLowestPriceDeal() { return lowestPriceDeal; }
    public void setLowestPriceDeal(ListingDto lowestPriceDeal) { this.lowestPriceDeal = lowestPriceDeal; }

    public ListingDto getBestValueDeal() { return bestValueDeal; }
    public void setBestValueDeal(ListingDto bestValueDeal) { this.bestValueDeal = bestValueDeal; }

    public ListingDto getFastestDeliveryDeal() { return fastestDeliveryDeal; }
    public void setFastestDeliveryDeal(ListingDto fastestDeliveryDeal) { this.fastestDeliveryDeal = fastestDeliveryDeal; }

    public List<ProductResponse> getSimilarProducts() { return similarProducts; }
    public void setSimilarProducts(List<ProductResponse> similarProducts) { this.similarProducts = similarProducts; }
}

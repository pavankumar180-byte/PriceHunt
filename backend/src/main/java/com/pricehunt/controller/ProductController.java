package com.pricehunt.controller;

import com.pricehunt.dto.PriceHistoryDto;
import com.pricehunt.dto.ProductResponse;
import com.pricehunt.service.PriceHistoryService;
import com.pricehunt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private PriceHistoryService priceHistoryService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "best_deal") String sortBy) {

        List<ProductResponse> results = productService.searchProducts(q, category, brand, minPrice, maxPrice, sortBy);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<PriceHistoryDto>> getProductPriceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(priceHistoryService.getHistoryForProduct(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands() {
        return ResponseEntity.ok(productService.getBrands());
    }
}

package com.pricehunt.controller;

import com.pricehunt.dto.UrlComparisonRequest;
import com.pricehunt.dto.UrlComparisonResponse;
import com.pricehunt.service.UrlComparisonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compare")
public class UrlComparisonController {

    @Autowired
    private UrlComparisonService urlComparisonService;

    /**
     * Main Product URL Comparison Endpoint (POST).
     * Accepts a product URL from Amazon, Flipkart, Croma, Reliance Digital, etc.
     */
    @PostMapping("/url")
    public ResponseEntity<UrlComparisonResponse> compareByUrlPost(@RequestBody UrlComparisonRequest request) {
        if (request == null || request.getUrl() == null || request.getUrl().isBlank()) {
            UrlComparisonResponse err = new UrlComparisonResponse();
            err.setSuccess(false);
            err.setMessage("Please provide a valid product URL.");
            return ResponseEntity.badRequest().body(err);
        }
        UrlComparisonResponse response = urlComparisonService.compareProductUrl(request.getUrl());
        return ResponseEntity.ok(response);
    }

    /**
     * Convenient GET fallback for testing: /api/compare/url?url=https://...
     */
    @GetMapping("/url")
    public ResponseEntity<UrlComparisonResponse> compareByUrlGet(@RequestParam String url) {
        if (url == null || url.isBlank()) {
            UrlComparisonResponse err = new UrlComparisonResponse();
            err.setSuccess(false);
            err.setMessage("URL parameter is required.");
            return ResponseEntity.badRequest().body(err);
        }
        UrlComparisonResponse response = urlComparisonService.compareProductUrl(url);
        return ResponseEntity.ok(response);
    }
}


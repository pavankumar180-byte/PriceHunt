package com.pricehunt.dto;

public class UrlComparisonRequest {
    private String url;

    public UrlComparisonRequest() {}

    public UrlComparisonRequest(String url) {
        this.url = url;
    }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}


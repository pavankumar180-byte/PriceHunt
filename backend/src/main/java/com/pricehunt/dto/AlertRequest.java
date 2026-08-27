package com.pricehunt.dto;

import java.math.BigDecimal;

public class AlertRequest {
    private Long productId;
    private BigDecimal targetPrice;

    public AlertRequest() {}
    public AlertRequest(Long productId, BigDecimal targetPrice) {
        this.productId = productId;
        this.targetPrice = targetPrice;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public BigDecimal getTargetPrice() { return targetPrice; }
    public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }
}

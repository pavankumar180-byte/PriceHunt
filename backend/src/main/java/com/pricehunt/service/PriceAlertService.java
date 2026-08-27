package com.pricehunt.service;

import com.pricehunt.dto.AlertRequest;
import com.pricehunt.entity.PriceAlert;
import com.pricehunt.entity.Product;
import com.pricehunt.entity.User;
import com.pricehunt.repository.PriceAlertRepository;
import com.pricehunt.repository.ProductRepository;
import com.pricehunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PriceAlertService {

    @Autowired
    private PriceAlertRepository priceAlertRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PriceAlert> getUserAlerts(Long userId) {
        return priceAlertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public PriceAlert createAlert(String userEmail, AlertRequest request) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));

        PriceAlert alert = new PriceAlert(user, product, request.getTargetPrice());
        return priceAlertRepository.save(alert);
    }

    public PriceAlert toggleAlert(Long alertId, String userEmail) {
        PriceAlert alert = priceAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found."));

        if (!alert.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new SecurityException("Unauthorized access to price alert.");
        }

        alert.setActive(!alert.getActive());
        return priceAlertRepository.save(alert);
    }

    public void deleteAlert(Long alertId, String userEmail) {
        PriceAlert alert = priceAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found."));

        if (!alert.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new SecurityException("Unauthorized access to price alert.");
        }

        priceAlertRepository.delete(alert);
    }

    public void checkAndTriggerAlerts(Long productId, BigDecimal currentLowestPrice) {
        List<PriceAlert> alerts = priceAlertRepository.findByProductIdAndActiveTrue(productId);
        for (PriceAlert alert : alerts) {
            if (currentLowestPrice.compareTo(alert.getTargetPrice()) <= 0) {
                alert.setNotified(true);
                priceAlertRepository.save(alert);
                // System notification hook / email trigger
                System.out.println(">>> [PRICE ALERT TRIGGERED] Product ID: " + productId + 
                        " reached target ₹" + alert.getTargetPrice() + " for User: " + alert.getUser().getEmail());
            }
        }
    }
}

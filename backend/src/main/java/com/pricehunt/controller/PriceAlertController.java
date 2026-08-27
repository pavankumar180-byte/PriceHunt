package com.pricehunt.controller;

import com.pricehunt.dto.AlertRequest;
import com.pricehunt.entity.PriceAlert;
import com.pricehunt.entity.User;
import com.pricehunt.service.AuthService;
import com.pricehunt.service.PriceAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class PriceAlertController {

    @Autowired
    private PriceAlertService priceAlertService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<PriceAlert>> getUserAlerts(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(priceAlertService.getUserAlerts(user.getId()));
    }

    @PostMapping
    public ResponseEntity<PriceAlert> createAlert(@RequestBody AlertRequest request, Authentication auth) {
        return ResponseEntity.ok(priceAlertService.createAlert(auth.getName(), request));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<PriceAlert> toggleAlert(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(priceAlertService.toggleAlert(id, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id, Authentication auth) {
        priceAlertService.deleteAlert(id, auth.getName());
        return ResponseEntity.ok(Map.of("message", "Price alert deleted successfully"));
    }
}

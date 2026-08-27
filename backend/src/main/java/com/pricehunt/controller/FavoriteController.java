package com.pricehunt.controller;

import com.pricehunt.entity.Favorite;
import com.pricehunt.entity.User;
import com.pricehunt.service.AuthService;
import com.pricehunt.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<Favorite>> getUserFavorites(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(favoriteService.getUserFavorites(user.getId()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Favorite> addFavorite(@PathVariable Long productId, Authentication auth) {
        return ResponseEntity.ok(favoriteService.addFavorite(auth.getName(), productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long productId, Authentication auth) {
        favoriteService.removeFavorite(auth.getName(), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Long productId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("isFavorite", false));
        }
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(Map.of("isFavorite", favoriteService.isFavorite(user.getId(), productId)));
    }
}

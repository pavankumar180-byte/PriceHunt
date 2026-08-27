package com.pricehunt.service;

import com.pricehunt.entity.Favorite;
import com.pricehunt.entity.Product;
import com.pricehunt.entity.User;
import com.pricehunt.repository.FavoriteRepository;
import com.pricehunt.repository.ProductRepository;
import com.pricehunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Favorite addFavorite(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (favoriteRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return favoriteRepository.findByUserIdAndProductId(user.getId(), productId).get();
        }

        Favorite fav = new Favorite(user, product);
        return favoriteRepository.save(fav);
    }

    @Transactional
    public void removeFavorite(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        favoriteRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
}

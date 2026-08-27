package com.pricehunt.service;

import com.pricehunt.dto.UserProfileDto;
import com.pricehunt.entity.User;
import com.pricehunt.repository.FavoriteRepository;
import com.pricehunt.repository.PriceAlertRepository;
import com.pricehunt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private PriceAlertRepository priceAlertRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        int favCount = favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        int alertCount = priceAlertRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setFavoritesCount(favCount);
        dto.setActiveAlertsCount(alertCount);
        return dto;
    }

    public UserProfileDto updateProfile(String currentEmail, String newName, String newEmail) {
        User user = userRepository.findByEmail(currentEmail.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (newName != null && !newName.isBlank()) {
            user.setName(newName.trim());
        }

        if (newEmail != null && !newEmail.isBlank() && !newEmail.equalsIgnoreCase(currentEmail)) {
            if (userRepository.existsByEmail(newEmail.trim().toLowerCase())) {
                throw new IllegalArgumentException("Email " + newEmail + " is already in use.");
            }
            user.setEmail(newEmail.trim().toLowerCase());
        }

        userRepository.save(user);
        return getProfile(user.getEmail());
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match.");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

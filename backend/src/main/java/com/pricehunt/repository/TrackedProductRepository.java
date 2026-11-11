package com.pricehunt.repository;

import com.pricehunt.entity.TrackedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrackedProductRepository extends JpaRepository<TrackedProduct, Long> {
    Optional<TrackedProduct> findByProductId(Long productId);
    Optional<TrackedProduct> findByProductIdAndUserId(Long productId, Long userId);
    List<TrackedProduct> findByTrackingEnabledTrue();
    List<TrackedProduct> findByUserId(Long userId);
    boolean existsByProductId(Long productId);
}


package com.pricehunt.repository;

import com.pricehunt.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByProductListingIdOrderByRecordedAtAsc(Long productListingId);

    @Query("SELECT ph FROM PriceHistory ph WHERE ph.productListing.product.id = :productId ORDER BY ph.recordedAt ASC")
    List<PriceHistory> findByProductIdOrderByRecordedAtAsc(@Param("productId") Long productId);

    @Query("SELECT ph FROM PriceHistory ph WHERE (ph.productId = :productId OR ph.productListing.product.id = :productId) AND ph.recordedAt >= :after ORDER BY ph.recordedAt ASC")
    List<PriceHistory> findByProductIdAndRecordedAtAfter(@Param("productId") Long productId, @Param("after") java.time.LocalDateTime after);
}

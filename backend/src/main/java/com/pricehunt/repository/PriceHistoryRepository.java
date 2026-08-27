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
}

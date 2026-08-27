package com.pricehunt.repository;

import com.pricehunt.entity.ProductListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {

    List<ProductListing> findByProductId(Long productId);

    List<ProductListing> findByProductIdOrderByPriceAsc(Long productId);

    @Query("SELECT l FROM ProductListing l WHERE LOWER(l.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<ProductListing> searchByTitle(@Param("query") String query);

    @Query("SELECT MIN(l.price) FROM ProductListing l WHERE l.product.id = :productId")
    Double findMinPriceByProductId(@Param("productId") Long productId);

    @Query("SELECT MAX(l.price) FROM ProductListing l WHERE l.product.id = :productId")
    Double findMaxPriceByProductId(@Param("productId") Long productId);
}

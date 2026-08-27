-- ============================================================================
-- PRICEHUNT DATABASE SCHEMA
-- Target Database: MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS pricehunt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pricehunt_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Platforms Table (E-commerce sources)
CREATE TABLE IF NOT EXISTS platforms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    website_url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    trust_score DECIMAL(3, 2) DEFAULT 4.50, -- Reliability rating out of 5.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table (Master canonical product entities)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g. Smartphones, Laptops, Headphones
    image_url VARCHAR(500),
    description TEXT,
    specs_json JSON, -- Key-value attributes (RAM, Storage, Color, Processor, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_category (category),
    INDEX idx_product_brand (brand),
    INDEX idx_product_model (model)
) ENGINE=InnoDB;

-- 4. Product Listings Table (Specific vendor listings mapped to a canonical product)
CREATE TABLE IF NOT EXISTS product_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    platform_id BIGINT NOT NULL,
    title VARCHAR(300) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN original_price > price THEN ROUND(((original_price - price) / original_price) * 100, 2)
            ELSE 0 
        END
    ) STORED,
    rating DECIMAL(2, 1) DEFAULT 4.0,
    review_count INT DEFAULT 0,
    seller_name VARCHAR(100) DEFAULT 'Authorized Seller',
    seller_rating DECIMAL(2, 1) DEFAULT 4.5,
    delivery_cost DECIMAL(6, 2) DEFAULT 0.00,
    delivery_days INT DEFAULT 2,
    in_stock BOOLEAN DEFAULT TRUE,
    product_url VARCHAR(500) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
    INDEX idx_listing_product (product_id),
    INDEX idx_listing_platform (platform_id),
    INDEX idx_listing_price (price)
) ENGINE=InnoDB;

-- 5. Price History Table (Tracks time-series price movements for charting)
CREATE TABLE IF NOT EXISTS price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_listing_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_listing_id) REFERENCES product_listings(id) ON DELETE CASCADE,
    INDEX idx_history_listing (product_listing_id),
    INDEX idx_history_recorded (recorded_at)
) ENGINE=InnoDB;

-- 6. Favorites / Watchlist Table
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_product_fav (user_id, product_id)
) ENGINE=InnoDB;

-- 7. Price Alerts Table (Trigger notifications when price <= target_price)
CREATE TABLE IF NOT EXISTS price_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    target_price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_alert_user (user_id),
    INDEX idx_alert_active (active)
) ENGINE=InnoDB;

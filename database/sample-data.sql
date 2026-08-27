-- ============================================================================
-- PRICEHUNT SAMPLE DATA SEED SCRIPT
-- Includes realistic listings for Smartphones, Laptops, and Headphones
-- ============================================================================

USE pricehunt_db;

-- 1. Seed Platforms
INSERT INTO platforms (id, name, website_url, logo_url, trust_score) VALUES
(1, 'Amazon', 'https://www.amazon.in', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 4.80),
(2, 'Flipkart', 'https://www.flipkart.com', 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', 4.70),
(3, 'Croma', 'https://www.croma.com', 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', 4.60),
(4, 'Reliance Digital', 'https://www.reliancedigital.in', 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', 4.55)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Seed Default Demo User (Password: "password123" hashed with BCrypt)
-- BCrypt for "password123": $2a$10$7R8gA1Qd01l1mHk1l1sZ5.gNn9yE5qjE6V2vR2h2qf3B1z7y0K2tK
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'John Doe', 'demo@pricehunt.com', '$2a$10$7R8gA1Qd01l1mHk1l1sZ5.gNn9yE5qjE6V2vR2h2qf3B1z7y0K2tK', 'ROLE_USER')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. Seed Products
INSERT INTO products (id, name, brand, model, category, image_url, description, specs_json) VALUES
(1, 'Apple iPhone 15 (128 GB, Blue)', 'Apple', 'iPhone 15', 'Smartphones', 
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
 'Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, and all-day battery life.',
 '{"storage": "128GB", "ram": "6GB", "color": "Blue", "display": "6.1-inch Super Retina XDR", "chip": "A16 Bionic"}'),

(2, 'Samsung Galaxy S24 5G (8GB RAM, 128GB Storage, Onyx Black)', 'Samsung', 'Galaxy S24', 'Smartphones',
 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
 'Galaxy AI is here. Circle to Search, Live Translate, and ProVisual Engine with 50MP camera.',
 '{"storage": "128GB", "ram": "8GB", "color": "Onyx Black", "display": "6.2-inch Dynamic AMOLED 2X", "chip": "Exynos 2400"}'),

(3, 'Apple MacBook Air M3 Chip (13.6-inch, 8GB RAM, 256GB SSD, Space Grey)', 'Apple', 'MacBook Air M3', 'Laptops',
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
 'Strikingly thin and fast with the latest M3 processor, Liquid Retina display, and up to 18 hours of battery.',
 '{"storage": "256GB SSD", "ram": "8GB Unified", "color": "Space Grey", "display": "13.6-inch Liquid Retina", "chip": "Apple M3 8-core"}'),

(4, 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones (Black)', 'Sony', 'WH-1000XM5', 'Headphones',
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
 'Two processors control 8 microphones for unprecedented noise cancellation. Auto NC Optimizer and 30-hour battery life.',
 '{"type": "Over-Ear", "anc": "Yes (Auto NC Optimizer)", "battery": "30 Hours", "color": "Black", "connectivity": "Bluetooth 5.2"}'),

(5, 'Dell XPS 15 9530 Laptop (13th Gen Intel Core i7-13700H, 16GB RAM, 1TB SSD, RTX 4050)', 'Dell', 'XPS 15', 'Laptops',
 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
 'Immerse yourself in content with stunning 3.5K OLED InfinityEdge display and high-performance RTX 4050 graphics.',
 '{"storage": "1TB NVMe SSD", "ram": "16GB DDR5", "color": "Platinum Silver", "display": "15.6-inch OLED 3.5K", "chip": "Intel Core i7-13700H"}')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Seed Product Listings (Multi-platform offerings for comparison)
INSERT INTO product_listings (id, product_id, platform_id, title, price, original_price, rating, review_count, seller_name, seller_rating, delivery_cost, delivery_days, in_stock, product_url) VALUES
-- Apple iPhone 15 Listings
(1, 1, 1, 'Apple iPhone 15 (128 GB) - Blue', 64999.00, 79900.00, 4.6, 3840, 'Appario Retail Pvt Ltd', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in/dp/B0CHX1W1XY'),
(2, 1, 2, 'Apple iPhone 15 (Blue, 128 GB)', 63999.00, 79900.00, 4.5, 4210, 'SuperComNet', 4.6, 0.00, 2, TRUE, 'https://www.flipkart.com/apple-iphone-15-blue-128-gb/p/itm12345'),
(3, 1, 3, 'Apple iPhone 15 128GB Blue (5G, A16 Bionic)', 65490.00, 79900.00, 4.4, 520, 'Croma Official Store', 4.7, 0.00, 1, TRUE, 'https://www.croma.com/apple-iphone-15-128gb-blue/p/274981'),
(4, 1, 4, 'iPhone 15 128 GB, Blue - Apple', 64499.00, 79900.00, 4.3, 310, 'Reliance Retail', 4.5, 99.00, 3, TRUE, 'https://www.reliancedigital.in/apple-iphone-15-128gb-blue/p/4938392'),

-- Samsung Galaxy S24 Listings
(5, 2, 1, 'Samsung Galaxy S24 5G (Onyx Black, 8GB, 128GB Storage)', 74999.00, 79999.00, 4.5, 1250, 'STPL Exclusive', 4.7, 0.00, 1, TRUE, 'https://www.amazon.in/dp/B0CQ2W566R'),
(6, 2, 2, 'SAMSUNG Galaxy S24 5G (Onyx Black, 128 GB) (8 GB RAM)', 72999.00, 79999.00, 4.6, 1890, 'IndiFlashMart', 4.7, 0.00, 2, TRUE, 'https://www.flipkart.com/samsung-galaxy-s24-onyx-black/p/itm98765'),
(7, 2, 3, 'Samsung S24 5G 8GB/128GB Onyx Black', 75999.00, 79999.00, 4.3, 180, 'Croma Official', 4.6, 0.00, 1, TRUE, 'https://www.croma.com/samsung-s24-onyx-black/p/302911'),

-- Apple MacBook Air M3 Listings
(8, 3, 1, 'Apple 2024 MacBook Air 13″ Laptop with M3 chip: 8GB Unified Memory, 256GB SSD - Space Grey', 104990.00, 114900.00, 4.7, 890, 'Appario Retail Pvt Ltd', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in/dp/B0CX23NS37'),
(9, 3, 2, 'Apple MacBook Air M3 - (8 GB/256 GB SSD/macOS Sonoma) MRXN3HN/A', 102990.00, 114900.00, 4.6, 640, 'TrueCom Retail', 4.5, 0.00, 2, TRUE, 'https://www.flipkart.com/apple-macbook-air-m3/p/itmm3apple'),
(10, 3, 3, 'Apple MacBook Air 13.6 Inch M3 Chip 8GB RAM 256GB SSD Space Grey', 104490.00, 114900.00, 4.5, 230, 'Croma Online', 4.7, 0.00, 1, TRUE, 'https://www.croma.com/apple-macbook-air-m3-space-grey/p/304889'),

-- Sony WH-1000XM5 Listings
(11, 4, 1, 'Sony WH-1000XM5 Wireless Industry Leading Active Noise Cancelling Headphones - Black', 26990.00, 34990.00, 4.5, 5420, 'Appario Retail Pvt Ltd', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in/dp/B09XS7JWHH'),
(12, 4, 2, 'SONY WH-1000XM5 Bluetooth Headset (Black, On the Ear)', 25990.00, 34990.00, 4.6, 4110, 'OmniTech Retail', 4.6, 0.00, 2, TRUE, 'https://www.flipkart.com/sony-wh-1000xm5-black/p/itmxm5sony'),
(13, 4, 3, 'Sony WH-1000XM5 Over-Ear Noise Cancelling Headphones with Mic (Black)', 27990.00, 34990.00, 4.4, 980, 'Croma Official', 4.7, 0.00, 1, TRUE, 'https://www.croma.com/sony-wh1000xm5-black/p/261901'),

-- Dell XPS 15 Listings
(14, 5, 1, 'Dell XPS 15 9530 Laptop, Intel Core i7-13700H, 16GB, 1TB SSD, RTX 4050 6GB GDDR6', 189990.00, 225990.00, 4.3, 210, 'Dell Authorized', 4.7, 0.00, 2, TRUE, 'https://www.amazon.in/dp/B0C39XPS15'),
(15, 5, 2, 'DELL XPS 15 Core i7 13th Gen - (16 GB/1 TB SSD/Windows 11/6 GB Graphics/NVIDIA GeForce RTX 4050)', 184990.00, 225990.00, 4.4, 145, 'FlashTech Hub', 4.4, 0.00, 3, TRUE, 'https://www.flipkart.com/dell-xps-15-9530/p/itmdellxps15')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Seed Price History for iPhone 15 on Amazon (Demonstrates price trajectory)
INSERT INTO price_history (product_listing_id, price, recorded_at) VALUES
(1, 74900.00, DATE_SUB(NOW(), INTERVAL 90 DAY)),
(1, 71999.00, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(1, 69900.00, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(1, 66999.00, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(1, 67499.00, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 64999.00, NOW());

-- 6. Seed Price History for iPhone 15 on Flipkart
INSERT INTO price_history (product_listing_id, price, recorded_at) VALUES
(2, 73900.00, DATE_SUB(NOW(), INTERVAL 90 DAY)),
(2, 70999.00, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(2, 68499.00, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(2, 65999.00, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 64999.00, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 63999.00, NOW());

-- 7. Seed Demo Favorites & Alerts
INSERT INTO favorites (id, user_id, product_id) VALUES
(1, 1, 1), -- iPhone 15 in favorites
(2, 1, 3)  -- MacBook Air in favorites
ON DUPLICATE KEY UPDATE id=VALUES(id);

INSERT INTO price_alerts (id, user_id, product_id, target_price, active) VALUES
(1, 1, 1, 62000.00, TRUE), -- Alert when iPhone 15 drops below 62k
(2, 1, 4, 25000.00, TRUE)  -- Alert when Sony XM5 drops below 25k
ON DUPLICATE KEY UPDATE id=VALUES(id);

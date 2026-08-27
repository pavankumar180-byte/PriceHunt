-- ============================================================================
-- PRICEHUNT EXPANDED SAMPLE DATA SEED SCRIPT
-- Realistic items for Smartphones, Laptops, Shoes, Watches, and Audio
-- ============================================================================

USE pricehunt_db;

-- 1. Seed Platforms
INSERT INTO platforms (id, name, website_url, logo_url, trust_score) VALUES
(1, 'Amazon', 'https://www.amazon.in', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 4.80),
(2, 'Flipkart', 'https://www.flipkart.com', 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', 4.70),
(3, 'Croma', 'https://www.croma.com', 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', 4.60),
(4, 'Myntra', 'https://www.myntra.com', 'https://images.indianexpress.com/2021/01/myntra.png', 4.70),
(5, 'Reliance Digital', 'https://www.reliancedigital.in', 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', 4.55)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Seed Default Demo User (Password: "password123")
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'John Doe', 'demo@pricehunt.com', '$2a$10$7R8gA1Qd01l1mHk1l1sZ5.gNn9yE5qjE6V2vR2h2qf3B1z7y0K2tK', 'ROLE_USER')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. Seed Products
INSERT INTO products (id, name, brand, model, category, image_url, description, specs_json) VALUES
-- Smartphones
(1, 'Apple iPhone 15 (128 GB, Blue)', 'Apple', 'iPhone 15', 'Smartphones', 
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
 'Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, and all-day battery life.',
 '{"storage": "128GB", "ram": "6GB", "color": "Blue", "display": "6.1-inch Super Retina XDR"}'),

(2, 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)', 'Samsung', 'Galaxy S24 Ultra', 'Smartphones',
 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
 'Galaxy AI is here. Titanium frame, 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3 for Galaxy.',
 '{"storage": "256GB", "ram": "12GB", "color": "Titanium Gray", "display": "6.8-inch QHD+ AMOLED", "chip": "Snapdragon 8 Gen 3"}'),

-- Laptops
(3, 'Apple MacBook Air M3 Chip (13.6-inch, 8GB RAM, 256GB SSD, Space Grey)', 'Apple', 'MacBook Air M3', 'Laptops',
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
 'Strikingly thin and fast with the latest M3 processor, Liquid Retina display, and up to 18 hours of battery.',
 '{"storage": "256GB SSD", "ram": "8GB Unified", "color": "Space Grey", "display": "13.6-inch Liquid Retina"}'),

(4, 'Dell XPS 15 9530 Laptop (Intel Core i7-13700H, 16GB RAM, 1TB SSD, RTX 4050)', 'Dell', 'XPS 15', 'Laptops',
 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
 'Stunning 3.5K OLED InfinityEdge display, RTX 4050 6GB graphics, machined aluminum chassis.',
 '{"storage": "1TB NVMe SSD", "ram": "16GB DDR5", "processor": "Intel Core i7-13700H", "display": "15.6-inch OLED 3.5K"}'),

(5, 'ASUS ROG Zephyrus G14 Gaming Laptop (Ryzen 9, 16GB RAM, 1TB SSD, RTX 4060)', 'ASUS', 'ROG Zephyrus G14', 'Laptops',
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
 'Ultra-portable gaming beast with 3K 120Hz OLED display, AMD Ryzen 9 8945HS, and NVIDIA GeForce RTX 4060.',
 '{"storage": "1TB SSD", "ram": "16GB LPDDR5X", "processor": "AMD Ryzen 9 8945HS", "gpu": "RTX 4060 8GB"}'),

-- Shoes
(6, 'Nike Air Jordan 1 Retro High OG (Chicago Red/White/Black)', 'Nike', 'Air Jordan 1 Retro', 'Shoes',
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
 'The iconic high-top basketball sneaker crafted with genuine premium leather and encapsulated Nike Air cushioning.',
 '{"type": "High-Top Sneaker", "material": "Genuine Leather", "color": "Chicago Red/White/Black", "sole": "Rubber Cupsole"}'),

(7, 'Adidas Ultraboost Light Running Shoes (Core Black / Solar Red)', 'Adidas', 'Ultraboost Light', 'Shoes',
 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
 'Experience epic energy with the lightest Ultraboost ever made. Light BOOST midsole with Continental Better Rubber outsole.',
 '{"type": "Performance Running", "cushioning": "Light BOOST", "weight": "299g", "color": "Core Black"}'),

(8, 'New Balance 550 Vintage White Lifestyle Sneakers', 'New Balance', '550', 'Shoes',
 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80',
 'Simple and clean, not overbuilt. A tribute to the 1989 basketball pro shoe that defined a generation.',
 '{"type": "Lifestyle / Heritage", "material": "Leather & Suede", "color": "White with Navy", "sole": "Non-marking Rubber"}'),

-- Watches
(9, 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium Case with Ocean Band)', 'Apple', 'Watch Ultra 2', 'Watches',
 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
 'The most rugged and capable Apple Watch. Powered by S9 SiP with 3000-nit display and 36-hour battery life.',
 '{"case": "49mm Aerospace Titanium", "display": "3000-nit Always-On Retina", "battery": "Up to 36 Hours", "waterproof": "100m"}'),

(10, 'Samsung Galaxy Watch 6 Classic (47mm, Bluetooth, Rotating Bezel, Silver)', 'Samsung', 'Galaxy Watch 6 Classic', 'Watches',
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
 'Timeless stainless steel style featuring physical rotating bezel, Advanced Sleep Coaching, and BioActive sensor.',
 '{"size": "47mm Stainless Steel", "display": "Sapphire Crystal Super AMOLED", "bezel": "Rotating", "battery": "Up to 40 Hours"}'),

(11, 'Fossil Grant Chronograph Dark Brown Leather Watch (FS4813)', 'Fossil', 'Grant Chronograph', 'Watches',
 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
 'Vintage-inspired classic quartz chronograph watch with Roman numeral indexes and genuine supple brown leather band.',
 '{"case": "44mm Stainless Steel", "strap": "22mm Genuine Leather", "movement": "Quartz Chronograph", "waterproof": "50m"}'),

-- Audio
(12, 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)', 'Sony', 'WH-1000XM5', 'Headphones',
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
 'Industry leading noise cancellation with two processors and 8 microphones. 30-hour battery life.',
 '{"type": "Over-Ear", "anc": "Yes (Auto NC Optimizer)", "battery": "30 Hours", "color": "Black"}'),

(13, 'Apple AirPods Pro (2nd Gen with USB-C MagSafe Case)', 'Apple', 'AirPods Pro 2', 'Headphones',
 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio.',
 '{"type": "In-Ear True Wireless", "chip": "Apple H2", "anc": "Yes", "battery": "Up to 30 Hours with Case"}')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Seed Product Listings
INSERT INTO product_listings (id, product_id, platform_id, title, price, original_price, rating, review_count, seller_name, seller_rating, delivery_cost, delivery_days, in_stock, product_url) VALUES
(1, 1, 1, 'Apple iPhone 15 (128 GB) - Blue', 64999.00, 79900.00, 4.6, 3840, 'Appario Retail', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in/dp/B0CHX1W1XY'),
(2, 1, 2, 'Apple iPhone 15 (Blue, 128 GB)', 63999.00, 79900.00, 4.5, 4210, 'SuperComNet', 4.6, 0.00, 2, TRUE, 'https://www.flipkart.com'),
(3, 2, 2, 'SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)', 119999.00, 129999.00, 4.7, 1890, 'IndiFlashMart', 4.7, 0.00, 2, TRUE, 'https://www.flipkart.com'),
(4, 2, 1, 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)', 121999.00, 129999.00, 4.6, 2250, 'STPL Exclusive', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in'),
(5, 3, 2, 'Apple MacBook Air M3 - (8 GB/256 GB SSD)', 102990.00, 114900.00, 4.6, 640, 'TrueCom', 4.5, 0.00, 2, TRUE, 'https://www.flipkart.com'),
(6, 3, 1, 'Apple 2024 MacBook Air 13″ Laptop with M3 chip', 104990.00, 114900.00, 4.7, 890, 'Appario Retail', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in'),
(7, 4, 2, 'DELL XPS 15 Core i7 13th Gen - (16 GB/1 TB SSD/RTX 4050)', 184990.00, 225990.00, 4.4, 145, 'FlashTech', 4.5, 0.00, 3, TRUE, 'https://www.flipkart.com'),
(8, 4, 1, 'Dell XPS 15 9530 Laptop, Intel i7-13700H, RTX 4050', 189990.00, 225990.00, 4.5, 210, 'Dell Authorized', 4.8, 0.00, 2, TRUE, 'https://www.amazon.in'),
(9, 5, 1, 'ASUS ROG Zephyrus G14 (2024) 3K OLED, Ryzen 9, RTX 4060', 149990.00, 174990.00, 4.6, 380, 'Appario Retail', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in'),
(10, 6, 4, 'Nike Air Jordan 1 Retro High OG Sneakers', 14995.00, 17995.00, 4.8, 1240, 'Nike Official Store', 4.9, 0.00, 2, TRUE, 'https://www.myntra.com'),
(11, 6, 1, 'Nike Mens Air Jordan 1 Retro High Basketball Shoes', 15995.00, 17995.00, 4.7, 850, 'SoleHub India', 4.7, 0.00, 1, TRUE, 'https://www.amazon.in'),
(12, 7, 4, 'Adidas Men Ultraboost Light Running Shoes', 9999.00, 18999.00, 4.6, 2310, 'Adidas India Marketing', 4.8, 0.00, 2, TRUE, 'https://www.myntra.com'),
(13, 8, 4, 'New Balance Unisex 550 Retro Low-Top Sneakers', 8499.00, 10999.00, 4.7, 680, 'Brandz Retail', 4.7, 0.00, 2, TRUE, 'https://www.myntra.com'),
(14, 9, 1, 'Apple Watch Ultra 2 [GPS + Cellular 49 mm] Titanium Case', 84900.00, 89900.00, 4.8, 950, 'Appario Retail', 4.8, 0.00, 1, TRUE, 'https://www.amazon.in'),
(15, 10, 2, 'SAMSUNG Galaxy Watch6 Classic (Bluetooth, 47mm, Silver)', 28999.00, 41999.00, 4.6, 1540, 'IndiFlashMart', 4.7, 0.00, 2, TRUE, 'https://www.flipkart.com'),
(16, 11, 4, 'Fossil Men Grant Chronograph Analogue Watch FS4813', 7495.00, 13495.00, 4.6, 3410, 'Fossil India Retail', 4.8, 0.00, 2, TRUE, 'https://www.myntra.com'),
(17, 12, 2, 'SONY WH-1000XM5 Bluetooth Headset (Black, Over Ear)', 25990.00, 34990.00, 4.6, 4110, 'OmniTech', 4.6, 0.00, 2, TRUE, 'https://www.flipkart.com'),
(18, 13, 2, 'Apple AirPods Pro (2nd generation) with MagSafe Case (USB-C)', 19999.00, 24900.00, 4.8, 8740, 'SuperComNet', 4.7, 0.00, 2, TRUE, 'https://www.flipkart.com')
ON DUPLICATE KEY UPDATE title=VALUES(title);

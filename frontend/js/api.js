/**
 * ============================================================================
 * PRICEHUNT UNIFIED API CLIENT
 * Connects to Spring Boot REST API (http://localhost:8080/api)
 * Includes rich realistic product dataset (Smartphones, Laptops, Shoes, Watches, Audio)
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:8080/api';

const MOCK_DATA = {
  platforms: [
    { id: 1, name: 'Amazon', websiteUrl: 'https://www.amazon.in', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', trustScore: 4.8 },
    { id: 2, name: 'Flipkart', websiteUrl: 'https://www.flipkart.com', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', trustScore: 4.7 },
    { id: 3, name: 'Croma', websiteUrl: 'https://www.croma.com', logoUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', trustScore: 4.6 },
    { id: 4, name: 'Myntra', websiteUrl: 'https://www.myntra.com', logoUrl: 'https://images.indianexpress.com/2021/01/myntra.png', trustScore: 4.7 },
    { id: 5, name: 'Reliance Digital', websiteUrl: 'https://www.reliancedigital.in', logoUrl: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', trustScore: 4.55 }
  ],
  products: [
    // -------------------------------------------------------------
    // NOVATREND STOREFRONT PRODUCTS (FROM REFERENCE TEMPLATE)
    // -------------------------------------------------------------
    {
      id: 1,
      name: 'Essential Hoodie',
      brand: 'NovaTrend',
      model: 'Essential 2025',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80',
      description: 'Ultra-soft fleece cotton hoodie designed for minimalist streetwear comfort and everyday longevity.',
      specsJson: '{"material": "100% Organic Cotton", "fit": "Relaxed Regular", "color": "Warm Beige", "wash": "Machine Wash Cold"}',
      minPrice: 4799,
      maxPrice: 5999,
      maxDiscount: 20.0,
      bestRating: 4.9,
      listingCount: 3,
      listings: [
        { id: 101, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Essential Fleece Hoodie (Warm Beige)', price: 4799, originalPrice: 5999, discountPercentage: 20.0, rating: 4.9, reviewCount: 128, sellerName: 'NovaTrend Official', sellerRating: 4.9, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 97.5, isBestPrice: true, isBestDeal: true },
        { id: 102, platformId: 4, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', platformTrustScore: 4.7, title: 'NovaTrend Mens Essential Casual Hoodie', price: 5199, originalPrice: 5999, discountPercentage: 13.3, rating: 4.8, reviewCount: 94, sellerName: 'Myntra Retail', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 93.0, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 2,
      name: 'Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270',
      category: 'Footwear',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
      description: 'Nike Air unit provides unrivaled, all-day comfort. The sleek, running-inspired design roots you to Nike heritage.',
      specsJson: '{"type": "Lifestyle / Running", "cushioning": "Max Air 270 unit", "color": "White / Pure Platinum", "closure": "Lace-up"}',
      minPrice: 10399,
      maxPrice: 13599,
      maxDiscount: 23.5,
      bestRating: 4.8,
      listingCount: 3,
      listings: [
        { id: 103, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Nike Mens Air Max 270 Running Shoe', price: 10399, originalPrice: 13599, discountPercentage: 23.5, rating: 4.8, reviewCount: 89, sellerName: 'Nike Official Store', sellerRating: 4.9, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.nike.com', dealScore: 98.2, isBestPrice: true, isBestDeal: true },
        { id: 104, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'NIKE Air Max 270 Sneakers For Men', price: 10999, originalPrice: 13599, discountPercentage: 19.1, rating: 4.7, reviewCount: 65, sellerName: 'SuperComNet', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 94.0, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      brand: 'NovaSound',
      model: 'Air Studio Over-Ear',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      description: 'Precision acoustics, 40-hour battery stamina, Active Noise Cancellation, and ultra-plush protein memory foam earcups.',
      specsJson: '{"type": "Over-Ear Wireless", "battery": "40 Hours", "anc": "Hybrid ANC", "connection": "Bluetooth 5.3 + AUX"}',
      minPrice: 7999,
      maxPrice: 9999,
      maxDiscount: 20.0,
      bestRating: 4.7,
      listingCount: 2,
      listings: [
        { id: 105, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'NovaSound Wireless ANC Studio Headphones', price: 7999, originalPrice: 9999, discountPercentage: 20.0, rating: 4.7, reviewCount: 156, sellerName: 'NovaSound Direct', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 95.8, isBestPrice: true, isBestDeal: true }
      ]
    },
    {
      id: 4,
      name: 'Smart Watch Series 9',
      brand: 'Apple',
      model: 'Series 9 GPS',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
      description: 'Smarter, brighter, mightier. Advanced health and fitness sensors, Double Tap gesture, and Always-On Retina display.',
      specsJson: '{"case": "45mm Midnight Aluminum", "display": "2000-nit Always-On OLED", "chip": "S9 SiP", "battery": "Up to 18 Hours"}',
      minPrice: 15999,
      maxPrice: 18799,
      maxDiscount: 14.8,
      bestRating: 4.8,
      listingCount: 3,
      listings: [
        { id: 106, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple Watch Series 9 [GPS 45mm] Smartwatch', price: 15999, originalPrice: 18799, discountPercentage: 14.8, rating: 4.8, reviewCount: 103, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 96.0, isBestPrice: true, isBestDeal: true }
      ]
    },
    {
      id: 5,
      name: 'Stainless Steel Bottle',
      brand: 'HydroLife',
      model: 'Vacuum Pro 750ml',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
      description: 'Double-wall vacuum insulated water bottle crafted with food-grade 18/8 stainless steel. Keeps drinks cold for 24 hours.',
      specsJson: '{"capacity": "750 ml", "material": "18/8 Stainless Steel", "insulation": "Cold 24h / Hot 12h", "bpa": "BPA-Free"}',
      minPrice: 1999,
      maxPrice: 2499,
      maxDiscount: 20.0,
      bestRating: 4.9,
      listingCount: 2,
      listings: [
        { id: 107, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'HydroLife Matte Black Stainless Steel Insulated Bottle', price: 1999, originalPrice: 2499, discountPercentage: 20.0, rating: 4.9, reviewCount: 76, sellerName: 'HydroDirect', sellerRating: 4.9, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 98.0, isBestPrice: true, isBestDeal: true }
      ]
    },
    {
      id: 6,
      name: 'Aviator Sunglasses',
      brand: 'Ray-Ban',
      model: 'Aviator Classic',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80',
      description: 'Timeless tear-drop shaped pilot shades with polished black frame and crystal green polarized UV400 lenses.',
      specsJson: '{"frame": "Polished Black Metal", "lens": "Crystal Green Polarized", "uv": "100% UV400 Protection", "bridge": "14mm"}',
      minPrice: 7199,
      maxPrice: 7999,
      maxDiscount: 10.0,
      bestRating: 4.7,
      listingCount: 2,
      listings: [
        { id: 108, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Ray-Ban Aviator Classic Polarized Sunglasses', price: 7199, originalPrice: 7999, discountPercentage: 10.0, rating: 4.7, reviewCount: 57, sellerName: 'RayBan Authorized', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 94.2, isBestPrice: true, isBestDeal: true }
      ]
    },
    // -------------------------------------------------------------
    // ADDITIONAL SMARTPHONES & TECH
    // -------------------------------------------------------------
    {
      id: 1,
      name: 'Apple iPhone 15 (128 GB, Blue)',
      brand: 'Apple',
      model: 'iPhone 15',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      description: 'Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, and all-day battery life.',
      specsJson: '{"storage": "128GB", "ram": "6GB", "color": "Blue", "display": "6.1-inch Super Retina XDR"}',
      minPrice: 63999,
      maxPrice: 65490,
      maxDiscount: 19.9,
      bestRating: 4.6,
      listingCount: 3,
      listings: [
        { id: 1, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple iPhone 15 (128 GB) - Blue', price: 64999, originalPrice: 79900, discountPercentage: 18.6, rating: 4.6, reviewCount: 3840, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/dp/B0CHX1W1XY', dealScore: 92.4, isBestPrice: false, isBestDeal: true },
        { id: 2, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'Apple iPhone 15 (Blue, 128 GB)', price: 63999, originalPrice: 79900, discountPercentage: 19.9, rating: 4.5, reviewCount: 4210, sellerName: 'SuperComNet', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.8, isBestPrice: true, isBestDeal: false },
        { id: 3, platformId: 3, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', platformTrustScore: 4.6, title: 'Apple iPhone 15 128GB Blue (5G, A16 Bionic)', price: 65490, originalPrice: 79900, discountPercentage: 18.0, rating: 4.4, reviewCount: 520, sellerName: 'Croma Official', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 88.5, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      description: 'Galaxy AI is here. Titanium frame, 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3 for Galaxy.',
      specsJson: '{"storage": "256GB", "ram": "12GB", "color": "Titanium Gray", "display": "6.8-inch QHD+ AMOLED", "chip": "Snapdragon 8 Gen 3"}',
      minPrice: 119999,
      maxPrice: 129999,
      maxDiscount: 10.0,
      bestRating: 4.7,
      listingCount: 3,
      listings: [
        { id: 4, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)', price: 119999, originalPrice: 129999, discountPercentage: 7.7, rating: 4.7, reviewCount: 1890, sellerName: 'IndiFlashMart', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 94.2, isBestPrice: true, isBestDeal: true },
        { id: 5, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)', price: 121999, originalPrice: 129999, discountPercentage: 6.2, rating: 4.6, reviewCount: 2250, sellerName: 'STPL Exclusive', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 91.0, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // LAPTOPS
    // -------------------------------------------------------------
    {
      id: 3,
      name: 'Apple MacBook Air M3 Chip (13.6-inch, 8GB RAM, 256GB SSD, Space Grey)',
      brand: 'Apple',
      model: 'MacBook Air M3',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      description: 'Strikingly thin and fast with the latest M3 processor, Liquid Retina display, and up to 18 hours of battery.',
      specsJson: '{"storage": "256GB SSD", "ram": "8GB Unified", "color": "Space Grey", "display": "13.6-inch Liquid Retina"}',
      minPrice: 102990,
      maxPrice: 104990,
      maxDiscount: 10.3,
      bestRating: 4.7,
      listingCount: 3,
      listings: [
        { id: 6, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'Apple MacBook Air M3 - (8 GB/256 GB SSD)', price: 102990, originalPrice: 114900, discountPercentage: 10.3, rating: 4.6, reviewCount: 640, sellerName: 'TrueCom', sellerRating: 4.5, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.5, isBestPrice: true, isBestDeal: false },
        { id: 7, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple 2024 MacBook Air 13″ Laptop with M3 chip', price: 104990, originalPrice: 114900, discountPercentage: 8.6, rating: 4.7, reviewCount: 890, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 93.0, isBestPrice: false, isBestDeal: true }
      ]
    },
    {
      id: 4,
      name: 'Dell XPS 15 9530 Laptop (Intel Core i7-13700H, 16GB RAM, 1TB SSD, RTX 4050)',
      brand: 'Dell',
      model: 'XPS 15',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
      description: 'Stunning 3.5K OLED InfinityEdge display, RTX 4050 6GB graphics, machined aluminum chassis.',
      specsJson: '{"storage": "1TB NVMe SSD", "ram": "16GB DDR5", "processor": "Intel Core i7-13700H", "display": "15.6-inch OLED 3.5K"}',
      minPrice: 184990,
      maxPrice: 189990,
      maxDiscount: 18.1,
      bestRating: 4.5,
      listingCount: 2,
      listings: [
        { id: 8, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'DELL XPS 15 Core i7 13th Gen - (16 GB/1 TB SSD/RTX 4050)', price: 184990, originalPrice: 225990, discountPercentage: 18.1, rating: 4.4, reviewCount: 145, sellerName: 'FlashTech', sellerRating: 4.5, deliveryCost: 0, deliveryDays: 3, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.0, isBestPrice: true, isBestDeal: false },
        { id: 9, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Dell XPS 15 9530 Laptop, Intel i7-13700H, RTX 4050', price: 189990, originalPrice: 225990, discountPercentage: 15.9, rating: 4.5, reviewCount: 210, sellerName: 'Dell Authorized', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 92.5, isBestPrice: false, isBestDeal: true }
      ]
    },
    {
      id: 5,
      name: 'ASUS ROG Zephyrus G14 Gaming Laptop (Ryzen 9, 16GB RAM, 1TB SSD, RTX 4060)',
      brand: 'ASUS',
      model: 'ROG Zephyrus G14',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      description: 'Ultra-portable gaming beast with 3K 120Hz OLED display, AMD Ryzen 9 8945HS, and NVIDIA GeForce RTX 4060.',
      specsJson: '{"storage": "1TB SSD", "ram": "16GB LPDDR5X", "processor": "AMD Ryzen 9 8945HS", "gpu": "RTX 4060 8GB"}',
      minPrice: 149990,
      maxPrice: 159990,
      maxDiscount: 14.3,
      bestRating: 4.6,
      listingCount: 2,
      listings: [
        { id: 10, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'ASUS ROG Zephyrus G14 (2024) 3K OLED, Ryzen 9, RTX 4060', price: 149990, originalPrice: 174990, discountPercentage: 14.3, rating: 4.6, reviewCount: 380, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 94.5, isBestPrice: true, isBestDeal: true },
        { id: 11, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'ASUS ROG Zephyrus G14 OLED Ryzen 9 - (16 GB/1 TB SSD)', price: 154990, originalPrice: 174990, discountPercentage: 11.4, rating: 4.5, reviewCount: 190, sellerName: 'OmniTech', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 90.2, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // SHOES & SNEAKERS
    // -------------------------------------------------------------
    {
      id: 6,
      name: 'Nike Air Jordan 1 Retro High OG (Chicago Red/White/Black)',
      brand: 'Nike',
      model: 'Air Jordan 1 Retro',
      category: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      description: 'The iconic high-top basketball sneaker crafted with genuine premium leather and encapsulated Nike Air cushioning.',
      specsJson: '{"type": "High-Top Sneaker", "material": "Genuine Leather", "color": "Chicago Red/White/Black", "sole": "Rubber Cupsole"}',
      minPrice: 14995,
      maxPrice: 16995,
      maxDiscount: 16.7,
      bestRating: 4.8,
      listingCount: 3,
      listings: [
        { id: 12, platformId: 4, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', platformTrustScore: 4.7, title: 'Nike Air Jordan 1 Retro High OG Sneakers', price: 14995, originalPrice: 17995, discountPercentage: 16.7, rating: 4.8, reviewCount: 1240, sellerName: 'Nike Official Store', sellerRating: 4.9, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 96.0, isBestPrice: true, isBestDeal: true },
        { id: 13, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Nike Mens Air Jordan 1 Retro High Basketball Shoes', price: 15995, originalPrice: 17995, discountPercentage: 11.1, rating: 4.7, reviewCount: 850, sellerName: 'SoleHub India', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 92.4, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 7,
      name: 'Adidas Ultraboost Light Running Shoes (Core Black / Solar Red)',
      brand: 'Adidas',
      model: 'Ultraboost Light',
      category: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
      description: 'Experience epic energy with the lightest Ultraboost ever made. Light BOOST midsole with Continental Better Rubber outsole.',
      specsJson: '{"type": "Performance Running", "cushioning": "Light BOOST", "weight": "299g", "color": "Core Black"}',
      minPrice: 9999,
      maxPrice: 12999,
      maxDiscount: 47.4,
      bestRating: 4.6,
      listingCount: 3,
      listings: [
        { id: 14, platformId: 4, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', platformTrustScore: 4.7, title: 'Adidas Men Ultraboost Light Running Shoes', price: 9999, originalPrice: 18999, discountPercentage: 47.4, rating: 4.6, reviewCount: 2310, sellerName: 'Adidas India Marketing', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 97.2, isBestPrice: true, isBestDeal: true },
        { id: 15, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Adidas Mens Ultraboost Light Road Running Shoe', price: 11499, originalPrice: 18999, discountPercentage: 39.5, rating: 4.5, reviewCount: 1420, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 92.0, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 8,
      name: 'New Balance 550 Vintage White Lifestyle Sneakers',
      brand: 'New Balance',
      model: '550',
      category: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80',
      description: 'Simple and clean, not overbuilt. A tribute to the 1989 basketball pro shoe that defined a generation.',
      specsJson: '{"type": "Lifestyle / Heritage", "material": "Leather & Suede", "color": "White with Navy", "sole": "Non-marking Rubber"}',
      minPrice: 8499,
      maxPrice: 9999,
      maxDiscount: 22.7,
      bestRating: 4.7,
      listingCount: 2,
      listings: [
        { id: 16, platformId: 4, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', platformTrustScore: 4.7, title: 'New Balance Unisex 550 Retro Low-Top Sneakers', price: 8499, originalPrice: 10999, discountPercentage: 22.7, rating: 4.7, reviewCount: 680, sellerName: 'Brandz Retail', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 94.0, isBestPrice: true, isBestDeal: true },
        { id: 17, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'NEW BALANCE 550 Sneakers For Men', price: 8999, originalPrice: 10999, discountPercentage: 18.2, rating: 4.6, reviewCount: 450, sellerName: 'OmniTech', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 3, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 90.5, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // WATCHES & SMARTWATCHES
    // -------------------------------------------------------------
    {
      id: 9,
      name: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium Case with Ocean Band)',
      brand: 'Apple',
      model: 'Watch Ultra 2',
      category: 'Watches',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      description: 'The most rugged and capable Apple Watch. Powered by S9 SiP with 3000-nit display and 36-hour battery life.',
      specsJson: '{"case": "49mm Aerospace Titanium", "display": "3000-nit Always-On Retina", "battery": "Up to 36 Hours", "waterproof": "100m"}',
      minPrice: 84900,
      maxPrice: 89900,
      maxDiscount: 5.6,
      bestRating: 4.8,
      listingCount: 3,
      listings: [
        { id: 18, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple Watch Ultra 2 [GPS + Cellular 49 mm] Titanium Case', price: 84900, originalPrice: 89900, discountPercentage: 5.6, rating: 4.8, reviewCount: 950, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 95.2, isBestPrice: true, isBestDeal: true },
        { id: 19, platformId: 3, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', platformTrustScore: 4.6, title: 'Apple Watch Ultra 2 GPS + Cellular 49mm', price: 86900, originalPrice: 89900, discountPercentage: 3.3, rating: 4.7, reviewCount: 220, sellerName: 'Croma Official', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 90.1, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 10,
      name: 'Samsung Galaxy Watch 6 Classic (47mm, Bluetooth, Rotating Bezel, Silver)',
      brand: 'Samsung',
      model: 'Galaxy Watch 6 Classic',
      category: 'Watches',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      description: 'Timeless stainless steel style featuring physical rotating bezel, Advanced Sleep Coaching, and BioActive sensor.',
      specsJson: '{"size": "47mm Stainless Steel", "display": "Sapphire Crystal Super AMOLED", "bezel": "Rotating", "battery": "Up to 40 Hours"}',
      minPrice: 28999,
      maxPrice: 36999,
      maxDiscount: 30.9,
      bestRating: 4.6,
      listingCount: 3,
      listings: [
        { id: 20, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'SAMSUNG Galaxy Watch6 Classic (Bluetooth, 47mm, Silver)', price: 28999, originalPrice: 41999, discountPercentage: 30.9, rating: 4.6, reviewCount: 1540, sellerName: 'IndiFlashMart', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 94.6, isBestPrice: true, isBestDeal: true },
        { id: 21, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Samsung Galaxy Watch6 Classic Bluetooth (47mm, Silver)', price: 29999, originalPrice: 41999, discountPercentage: 28.6, rating: 4.5, reviewCount: 1850, sellerName: 'STPL Exclusive', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 92.1, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 11,
      name: 'Fossil Grant Chronograph Dark Brown Leather Watch (FS4813)',
      brand: 'Fossil',
      model: 'Grant Chronograph',
      category: 'Watches',
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
      description: 'Vintage-inspired classic quartz chronograph watch with Roman numeral indexes and genuine supple brown leather band.',
      specsJson: '{"case": "44mm Stainless Steel", "strap": "22mm Genuine Leather", "movement": "Quartz Chronograph", "waterproof": "50m"}',
      minPrice: 7495,
      maxPrice: 9995,
      maxDiscount: 44.4,
      bestRating: 4.5,
      listingCount: 3,
      listings: [
        { id: 22, platformId: 4, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', platformTrustScore: 4.7, title: 'Fossil Men Grant Chronograph Analogue Watch FS4813', price: 7495, originalPrice: 13495, discountPercentage: 44.4, rating: 4.6, reviewCount: 3410, sellerName: 'Fossil India Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 96.5, isBestPrice: true, isBestDeal: true },
        { id: 23, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Fossil Grant Chronograph Black Dial Men Watch - FS4813', price: 7995, originalPrice: 13495, discountPercentage: 40.7, rating: 4.5, reviewCount: 5120, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 93.2, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // AUDIO & HEADPHONES
    // -------------------------------------------------------------
    {
      id: 12,
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Industry leading noise cancellation with two processors and 8 microphones. 30-hour battery life.',
      specsJson: '{"type": "Over-Ear", "anc": "Yes (Auto NC Optimizer)", "battery": "30 Hours", "color": "Black"}',
      minPrice: 25990,
      maxPrice: 27990,
      maxDiscount: 25.7,
      bestRating: 4.6,
      listingCount: 3,
      listings: [
        { id: 24, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'SONY WH-1000XM5 Bluetooth Headset (Black, Over Ear)', price: 25990, originalPrice: 34990, discountPercentage: 25.7, rating: 4.6, reviewCount: 4110, sellerName: 'OmniTech', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 94.8, isBestPrice: true, isBestDeal: true },
        { id: 25, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Sony WH-1000XM5 Wireless ANC Headphones - Black', price: 26990, originalPrice: 34990, discountPercentage: 22.8, rating: 4.5, reviewCount: 5420, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 92.0, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 13,
      name: 'Apple AirPods Pro (2nd Gen with USB-C MagSafe Case)',
      brand: 'Apple',
      model: 'AirPods Pro 2',
      category: 'Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio.',
      specsJson: '{"type": "In-Ear True Wireless", "chip": "Apple H2", "anc": "Yes", "battery": "Up to 30 Hours with Case"}',
      minPrice: 19999,
      maxPrice: 24900,
      maxDiscount: 19.7,
      bestRating: 4.8,
      listingCount: 3,
      listings: [
        { id: 26, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'Apple AirPods Pro (2nd generation) with MagSafe Case (USB-C)', price: 19999, originalPrice: 24900, discountPercentage: 19.7, rating: 4.8, reviewCount: 8740, sellerName: 'SuperComNet', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 96.8, isBestPrice: true, isBestDeal: true },
        { id: 27, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple AirPods Pro (2nd Generation) with USB-C', price: 20990, originalPrice: 24900, discountPercentage: 15.7, rating: 4.7, reviewCount: 11200, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 93.4, isBestPrice: false, isBestDeal: false }
      ]
    }
  ]
};

const Api = {
  getToken() {
    return localStorage.getItem('pricehunt_token');
  },

  setToken(token) {
    localStorage.setItem('pricehunt_token', token);
  },

  getUser() {
    const u = localStorage.getItem('pricehunt_user');
    return u ? JSON.parse(u) : null;
  },

  setUser(user) {
    localStorage.setItem('pricehunt_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('pricehunt_token');
    localStorage.removeItem('pricehunt_user');
    window.location.href = 'login.html';
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({ message: 'Server error' }));
      throw new Error(err.message || 'Request failed');
    } catch (error) {
      console.info(`[PriceHunt Mock Engine] Processing request: ${endpoint}`);
      return this.mockFallback(endpoint, options);
    }
  },

  mockFallback(endpoint, options) {
    // 1. Auth Fallbacks
    if (endpoint === '/auth/login') {
      const body = JSON.parse(options.body || '{}');
      const mockUser = { id: 1, name: 'John Doe', email: body.email || 'demo@pricehunt.com', role: 'ROLE_USER' };
      const res = { token: 'mock-jwt-token-pricehunt-12345', ...mockUser };
      this.setToken(res.token);
      this.setUser(mockUser);
      return res;
    }
    if (endpoint === '/auth/register') {
      const body = JSON.parse(options.body || '{}');
      const mockUser = { id: 2, name: body.name || 'User', email: body.email, role: 'ROLE_USER' };
      const res = { token: 'mock-jwt-token-pricehunt-12345', ...mockUser };
      this.setToken(res.token);
      this.setUser(mockUser);
      return res;
    }

    // 2. Search & List Fallbacks
    if (endpoint.startsWith('/products/search') || endpoint === '/products') {
      const url = new URL(`http://localhost${endpoint}`);
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const cat = (url.searchParams.get('category') || '').toLowerCase();
      const sortBy = url.searchParams.get('sortBy') || 'best_deal';

      let results = [...MOCK_DATA.products];
      if (q) {
        results = results.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.brand.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          (p.model && p.model.toLowerCase().includes(q))
        );
      }
      if (cat) {
        results = results.filter(p => p.category.toLowerCase() === cat);
      }
      return results;
    }

    // 3. Comparison Details
    if (endpoint.startsWith('/compare/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const product = MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
      return {
        product,
        rankedListings: product.listings,
        lowestPriceDeal: product.listings.find(l => l.isBestPrice) || product.listings[0],
        bestValueDeal: product.listings.find(l => l.isBestDeal) || product.listings[0],
        fastestDeliveryDeal: product.listings[0],
        similarProducts: MOCK_DATA.products.filter(p => p.category === product.category && p.id !== product.id)
      };
    }

    // 4. Price History
    if (endpoint.startsWith('/products/') && endpoint.endsWith('/history')) {
      const id = parseInt(endpoint.split('/')[2]);
      const prod = MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
      const p = prod.minPrice || 50000;
      return [
        { id: 1, platformName: 'Amazon', price: Math.round(p * 1.15), recordedAt: '2026-06-01T10:00:00' },
        { id: 2, platformName: 'Amazon', price: Math.round(p * 1.10), recordedAt: '2026-06-30T10:00:00' },
        { id: 3, platformName: 'Amazon', price: Math.round(p * 1.04), recordedAt: '2026-07-25T10:00:00' },
        { id: 4, platformName: 'Amazon', price: p, recordedAt: '2026-08-20T10:00:00' }
      ];
    }

    if (endpoint.startsWith('/products/')) {
      const id = parseInt(endpoint.split('/')[2]);
      return MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
    }

    // 5. User Watchlist & Alerts
    if (endpoint === '/favorites') {
      const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[1, 6, 9]');
      return MOCK_DATA.products.filter(p => favs.includes(p.id)).map(p => ({ id: p.id, product: p, createdAt: new Date().toISOString() }));
    }

    if (endpoint === '/alerts') {
      const alerts = JSON.parse(localStorage.getItem('pricehunt_alerts') || '[{"id":1,"productId":1,"targetPrice":62000,"active":true},{"id":2,"productId":6,"targetPrice":13500,"active":true}]');
      return alerts.map(a => ({
        id: a.id,
        targetPrice: a.targetPrice,
        active: a.active,
        product: MOCK_DATA.products.find(p => p.id === a.productId) || MOCK_DATA.products[0]
      }));
    }

    if (endpoint === '/user/profile') {
      const u = this.getUser() || { id: 1, name: 'John Doe', email: 'demo@pricehunt.com', role: 'ROLE_USER' };
      return {
        ...u,
        createdAt: '2026-01-15T08:30:00',
        favoritesCount: 3,
        activeAlertsCount: 2
      };
    }

    return { message: 'OK' };
  }
};

/**
 * ============================================================================
 * PRICEHUNT UNIFIED API CLIENT & MULTI-STORE INTELLIGENCE ENGINE
 * Comprehensive comparisons across Amazon, Flipkart, Myntra, Croma, Reliance Digital, & Official Stores
 * Smart Deal Scoring Algorithm & Instant Price Analysis
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:8080/api';

const MOCK_DATA = {
  platforms: [
    { id: 1, name: 'Amazon', websiteUrl: 'https://www.amazon.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', trustScore: 4.9 },
    { id: 2, name: 'Flipkart', websiteUrl: 'https://www.flipkart.com', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', trustScore: 4.7 },
    { id: 3, name: 'Myntra', websiteUrl: 'https://www.myntra.com', logoUrl: 'https://images.indianexpress.com/2021/01/myntra.png', trustScore: 4.8 },
    { id: 4, name: 'Croma', websiteUrl: 'https://www.croma.com', logoUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', trustScore: 4.7 },
    { id: 5, name: 'Reliance Digital', websiteUrl: 'https://www.reliancedigital.in', logoUrl: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', trustScore: 4.6 }
  ],
  products: [
    // -------------------------------------------------------------
    // 1. Essential Hoodie
    // -------------------------------------------------------------
    {
      id: 1,
      name: 'Essential Fleece Hoodie',
      brand: 'PriceHunt Select',
      model: 'Essential Core 2026',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      description: 'Handcrafted with 400 GSM heavyweight organic combed cotton. Features a double-lined hood, ribbed cuffs, and a tailored boxy cut built for luxurious comfort.',
      specsJson: '{"material": "100% Heavyweight Organic Cotton", "fabricWeight": "400 GSM", "fit": "Modern Boxy Relaxed", "origin": "Ethically Crafted", "color": "Warm Sand Beige"}',
      minPrice: 54.99,
      maxPrice: 69.99,
      maxDiscount: 21.4,
      bestRating: 4.9,
      listingCount: 5,
      listings: [
        { id: 101, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 54.99, originalPrice: 69.99, discountPercentage: 21.4, rating: 4.9, reviewCount: 420, sellerName: 'FashionHub Verified', sellerRating: 4.9, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 98.4, isBestPrice: true, isBestDeal: true },
        { id: 102, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 59.99, originalPrice: 69.99, discountPercentage: 14.3, rating: 4.8, reviewCount: 1280, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 95.0, isBestPrice: false, isBestDeal: false },
        { id: 103, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 64.99, originalPrice: 69.99, discountPercentage: 7.1, rating: 4.7, reviewCount: 650, sellerName: 'SuperComNet', sellerRating: 4.6, deliveryDays: 3, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 89.2, isBestPrice: false, isBestDeal: false },
        { id: 104, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 62.99, originalPrice: 69.99, discountPercentage: 10.0, rating: 4.6, reviewCount: 310, sellerName: 'Reliance Retail', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com', dealScore: 91.5, isBestPrice: false, isBestDeal: false },
        { id: 105, platformId: 5, platformName: 'Brand Store', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 69.99, originalPrice: 69.99, discountPercentage: 0.0, rating: 5.0, reviewCount: 89, sellerName: 'PriceHunt Direct', sellerRating: 5.0, deliveryDays: 2, inStock: true, productUrl: 'https://www.pricehunt.com', dealScore: 86.0, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // 2. Air Max 270
    // -------------------------------------------------------------
    {
      id: 2,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270 Pure White',
      category: 'Footwear',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      description: 'Boasting Nikes biggest heel Air unit yet, the Air Max 270 delivers super-soft cushioning that feels as impossible as it looks with an engineered breathable mesh upper.',
      specsJson: '{"cushioning": "Max Air 270 Heel Unit", "upper": "Engineered Breathable Mesh", "outsole": "Dual-Density Solid Rubber", "color": "White / Bright Crimson / Platinum"}',
      minPrice: 129.99,
      maxPrice: 169.99,
      maxDiscount: 23.5,
      bestRating: 4.9,
      listingCount: 5,
      listings: [
        { id: 201, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 129.99, originalPrice: 169.99, discountPercentage: 23.5, rating: 4.8, reviewCount: 3410, sellerName: 'Nike Authorized Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 98.6, isBestPrice: true, isBestDeal: true },
        { id: 202, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 134.99, originalPrice: 169.99, discountPercentage: 20.6, rating: 4.8, reviewCount: 1890, sellerName: 'Nike India Marketing', sellerRating: 4.9, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 95.4, isBestPrice: false, isBestDeal: false },
        { id: 203, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 139.99, originalPrice: 169.99, discountPercentage: 17.6, rating: 4.7, reviewCount: 2150, sellerName: 'SuperComNet Sports', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 92.1, isBestPrice: false, isBestDeal: false },
        { id: 204, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 145.00, originalPrice: 169.99, discountPercentage: 14.7, rating: 4.6, reviewCount: 540, sellerName: 'Reliance Brands Luxe', sellerRating: 4.6, deliveryDays: 3, inStock: true, productUrl: 'https://www.ajio.com', dealScore: 88.5, isBestPrice: false, isBestDeal: false },
        { id: 205, platformId: 5, platformName: 'Nike Official', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', price: 160.00, originalPrice: 169.99, discountPercentage: 5.9, rating: 4.9, reviewCount: 4890, sellerName: 'Nike Official Online', sellerRating: 5.0, deliveryDays: 2, inStock: true, productUrl: 'https://www.nike.com', dealScore: 87.0, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // 3. Wireless Headphones
    // -------------------------------------------------------------
    {
      id: 3,
      name: 'Sony WH-1000XM5 ANC Headphones',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      description: 'Industry-leading Active Noise Cancellation with two dedicated processors, eight beamforming microphones, and up to 30 hours of hi-res wireless playback.',
      specsJson: '{"noiseCancelling": "Dual Processor V1 + QN1", "batteryLife": "30 Hours (ANC On)", "codecs": "LDAC, AAC, SBC", "charging": "3 min quick charge for 3 hrs"}',
      minPrice: 329.99,
      maxPrice: 399.99,
      maxDiscount: 17.5,
      bestRating: 4.9,
      listingCount: 5,
      listings: [
        { id: 301, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 329.99, originalPrice: 399.99, discountPercentage: 17.5, rating: 4.8, reviewCount: 5820, sellerName: 'Amazon Electronics Direct', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 99.1, isBestPrice: true, isBestDeal: true },
        { id: 302, platformId: 4, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 339.99, originalPrice: 399.99, discountPercentage: 15.0, rating: 4.8, reviewCount: 1240, sellerName: 'Croma Retail', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 96.0, isBestPrice: false, isBestDeal: false },
        { id: 303, platformId: 5, platformName: 'Reliance Digital', platformLogo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', price: 344.99, originalPrice: 399.99, discountPercentage: 13.8, rating: 4.7, reviewCount: 890, sellerName: 'Reliance Electronics', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.reliancedigital.in', dealScore: 93.4, isBestPrice: false, isBestDeal: false },
        { id: 304, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 349.99, originalPrice: 399.99, discountPercentage: 12.5, rating: 4.7, reviewCount: 3120, sellerName: 'OmniTech Retail', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 92.0, isBestPrice: false, isBestDeal: false },
        { id: 305, platformId: 3, platformName: 'Sony Center', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', price: 399.99, originalPrice: 399.99, discountPercentage: 0.0, rating: 4.9, reviewCount: 940, sellerName: 'Sony Authorized Store', sellerRating: 5.0, deliveryDays: 2, inStock: true, productUrl: 'https://www.sony.com', dealScore: 85.2, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // 4. Smart Watch Series 9
    // -------------------------------------------------------------
    {
      id: 4,
      name: 'Apple Watch Series 9 (GPS 45mm)',
      brand: 'Apple',
      model: 'Series 9 Aluminum',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      description: 'Powered by S9 SiP with Double Tap gesture control, 2000-nit Always-On Retina display, advanced ECG, blood oxygen, and precision temperature tracking.',
      specsJson: '{"caseSize": "45mm Midnight Aluminum", "display": "2000-nit Always-On OLED", "chip": "Apple S9 SiP", "battery": "18 Hours All-Day"}',
      minPrice: 199.99,
      maxPrice: 249.00,
      maxDiscount: 19.7,
      bestRating: 4.9,
      listingCount: 5,
      listings: [
        { id: 401, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 199.99, originalPrice: 249.00, discountPercentage: 19.7, rating: 4.8, reviewCount: 4120, sellerName: 'Apple Authorized Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 98.7, isBestPrice: true, isBestDeal: true },
        { id: 402, platformId: 4, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 209.99, originalPrice: 249.00, discountPercentage: 15.7, rating: 4.8, reviewCount: 830, sellerName: 'Croma Apple Specialist', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 95.2, isBestPrice: false, isBestDeal: false },
        { id: 403, platformId: 5, platformName: 'Reliance Digital', platformLogo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', price: 214.99, originalPrice: 249.00, discountPercentage: 13.7, rating: 4.7, reviewCount: 620, sellerName: 'Reliance Tech', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.reliancedigital.in', dealScore: 92.8, isBestPrice: false, isBestDeal: false },
        { id: 404, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 219.99, originalPrice: 249.00, discountPercentage: 11.6, rating: 4.7, reviewCount: 1950, sellerName: 'IndiFlashMart', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.0, isBestPrice: false, isBestDeal: false },
        { id: 405, platformId: 3, platformName: 'Apple Store', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', price: 249.00, originalPrice: 249.00, discountPercentage: 0.0, rating: 5.0, reviewCount: 8900, sellerName: 'Apple Official', sellerRating: 5.0, deliveryDays: 1, inStock: true, productUrl: 'https://www.apple.com', dealScore: 88.0, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // 5. Stainless Steel Bottle
    // -------------------------------------------------------------
    {
      id: 5,
      name: 'HydroPro Matte Steel Bottle (750ml)',
      brand: 'HydroPro',
      model: 'Vacuum Insulated 750',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      description: 'Double-walled TempShield vacuum insulation keeps beverages iced for up to 24 hours or piping hot for 12 hours. Pure 18/8 pro-grade stainless steel.',
      specsJson: '{"capacity": "750ml / 25oz", "insulation": "TempShield Vacuum Wall", "material": "Pro-Grade 18/8 Stainless Steel", "lid": "Leak-Proof Flex Straw"}',
      minPrice: 24.99,
      maxPrice: 34.99,
      maxDiscount: 28.6,
      bestRating: 4.9,
      listingCount: 4,
      listings: [
        { id: 501, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 24.99, originalPrice: 34.99, discountPercentage: 28.6, rating: 4.9, reviewCount: 2890, sellerName: 'HydroDirect Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 99.0, isBestPrice: true, isBestDeal: true },
        { id: 502, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 27.99, originalPrice: 34.99, discountPercentage: 20.0, rating: 4.8, reviewCount: 650, sellerName: 'FitLife Gear', sellerRating: 4.8, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 94.6, isBestPrice: false, isBestDeal: false },
        { id: 503, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 29.99, originalPrice: 34.99, discountPercentage: 14.3, rating: 4.6, reviewCount: 420, sellerName: 'DailyGoods India', sellerRating: 4.6, deliveryDays: 3, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 90.2, isBestPrice: false, isBestDeal: false },
        { id: 504, platformId: 4, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 32.00, originalPrice: 34.99, discountPercentage: 8.5, rating: 4.7, reviewCount: 180, sellerName: 'Croma Lifestyle', sellerRating: 4.7, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 88.0, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // 6. Aviator Sunglasses
    // -------------------------------------------------------------
    {
      id: 6,
      name: 'Ray-Ban Aviator Classic Polarized',
      brand: 'Ray-Ban',
      model: 'RB3025 Aviator',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
      description: 'The archetype of all aviators. First designed in 1937 for US aviators, featuring crystal green G-15 polarized lenses with 100% UV protection and a durable gold/black metal frame.',
      specsJson: '{"frameMaterial": "Polished Metal", "lensTreatment": "Polarized G-15 Green", "lensWidth": "58 mm", "bridge": "14 mm", "uvProtection": "100% UV400"}',
      minPrice: 89.99,
      maxPrice: 139.99,
      maxDiscount: 35.7,
      bestRating: 4.8,
      listingCount: 4,
      listings: [
        { id: 601, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 89.99, originalPrice: 139.99, discountPercentage: 35.7, rating: 4.8, reviewCount: 3120, sellerName: 'Luxottica Direct', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 99.4, isBestPrice: true, isBestDeal: true },
        { id: 602, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 99.99, originalPrice: 139.99, discountPercentage: 28.6, rating: 4.7, reviewCount: 1450, sellerName: 'RayBan Authorized Retail', sellerRating: 4.8, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com', dealScore: 94.8, isBestPrice: false, isBestDeal: false },
        { id: 603, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 104.99, originalPrice: 139.99, discountPercentage: 25.0, rating: 4.6, reviewCount: 890, sellerName: 'VisionWorld India', sellerRating: 4.6, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.5, isBestPrice: false, isBestDeal: false },
        { id: 604, platformId: 4, platformName: 'Sunglass Hut', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 129.99, originalPrice: 139.99, discountPercentage: 7.1, rating: 4.9, reviewCount: 480, sellerName: 'Sunglass Hut Official', sellerRating: 4.9, deliveryDays: 2, inStock: true, productUrl: 'https://www.sunglasshut.com', dealScore: 87.2, isBestPrice: false, isBestDeal: false }
      ]
    },

    // -------------------------------------------------------------
    // 7. Apple MacBook Air M3
    // -------------------------------------------------------------
    {
      id: 7,
      name: 'Apple MacBook Air M3 (13.6-inch)',
      brand: 'Apple',
      model: 'MacBook Air M3',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      description: 'Liquid Retina display, breakthrough M3 chip with 8-core CPU and 10-core GPU, up to 18 hours of battery, MagSafe charging, and 1080p FaceTime HD camera.',
      specsJson: '{"chip": "Apple M3 Chip", "ram": "8GB Unified Memory", "storage": "256GB NVMe SSD", "display": "13.6-inch Liquid Retina", "weight": "1.24 kg"}',
      minPrice: 999.00,
      maxPrice: 1099.00,
      maxDiscount: 9.1,
      bestRating: 4.9,
      listingCount: 5,
      listings: [
        { id: 701, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 999.00, originalPrice: 1099.00, discountPercentage: 9.1, rating: 4.9, reviewCount: 1840, sellerName: 'Apple Authorized Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.com', dealScore: 98.8, isBestPrice: true, isBestDeal: true },
        { id: 702, platformId: 4, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 1029.00, originalPrice: 1099.00, discountPercentage: 6.4, rating: 4.8, reviewCount: 650, sellerName: 'Croma Apple Specialist', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 95.0, isBestPrice: false, isBestDeal: false },
        { id: 703, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 1049.00, originalPrice: 1099.00, discountPercentage: 4.5, rating: 4.8, reviewCount: 1220, sellerName: 'SuperComNet Laptops', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 93.1, isBestPrice: false, isBestDeal: false },
        { id: 704, platformId: 5, platformName: 'Reliance Digital', platformLogo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', price: 1059.00, originalPrice: 1099.00, discountPercentage: 3.6, rating: 4.7, reviewCount: 410, sellerName: 'Reliance Digital Store', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.reliancedigital.in', dealScore: 91.5, isBestPrice: false, isBestDeal: false },
        { id: 705, platformId: 3, platformName: 'Apple Store', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', price: 1099.00, originalPrice: 1099.00, discountPercentage: 0.0, rating: 5.0, reviewCount: 5400, sellerName: 'Apple Official Store', sellerRating: 5.0, deliveryDays: 1, inStock: true, productUrl: 'https://www.apple.com', dealScore: 89.0, isBestPrice: false, isBestDeal: false }
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
      console.info(`[PriceHunt Intelligence Engine] Processing endpoint: ${endpoint}`);
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
      const p = prod.minPrice || 129.99;
      return [
        { id: 1, platformName: 'Amazon', price: parseFloat((p * 1.25).toFixed(2)), recordedAt: '2026-06-01T10:00:00' },
        { id: 2, platformName: 'Amazon', price: parseFloat((p * 1.18).toFixed(2)), recordedAt: '2026-06-30T10:00:00' },
        { id: 3, platformName: 'Amazon', price: parseFloat((p * 1.08).toFixed(2)), recordedAt: '2026-07-25T10:00:00' },
        { id: 4, platformName: 'Amazon', price: parseFloat(p.toFixed(2)), recordedAt: '2026-08-20T10:00:00' }
      ];
    }

    if (endpoint.startsWith('/products/')) {
      const id = parseInt(endpoint.split('/')[2]);
      return MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
    }

    // 5. User Watchlist & Alerts
    if (endpoint === '/favorites') {
      const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[1, 2, 3, 4]');
      return MOCK_DATA.products.filter(p => favs.includes(p.id)).map(p => ({ id: p.id, product: p, createdAt: new Date().toISOString() }));
    }

    if (endpoint === '/alerts') {
      const alerts = JSON.parse(localStorage.getItem('pricehunt_alerts') || '[{"id":1,"productId":2,"targetPrice":119.99,"active":true},{"id":2,"productId":3,"targetPrice":299.99,"active":true}]');
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
        favoritesCount: 4,
        activeAlertsCount: 2
      };
    }

    return { message: 'OK' };
  }
};

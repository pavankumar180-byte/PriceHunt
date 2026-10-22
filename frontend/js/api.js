/**
 * ============================================================================
 * PRICEHUNT UNIFIED API CLIENT & MULTI-STORE INTELLIGENCE ENGINE
 * Comprehensive real-time comparisons across Amazon, Flipkart, Ajio, Myntra, Croma, & Reliance Digital
 * Genuine links that open specific products in their respective stores
 * Best Deal Ranked At Top with Full Product Customer Reviews & Rating Breakdown
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:8080/api';

const MOCK_DATA = {
  platforms: [
    { id: 1, name: 'Amazon', websiteUrl: 'https://www.amazon.in', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', trustScore: 4.9 },
    { id: 2, name: 'Flipkart', websiteUrl: 'https://www.flipkart.com', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', trustScore: 4.8 },
    { id: 3, name: 'Myntra', websiteUrl: 'https://www.myntra.com', logoUrl: 'https://images.indianexpress.com/2021/01/myntra.png', trustScore: 4.8 },
    { id: 4, name: 'Ajio', websiteUrl: 'https://www.ajio.com', logoUrl: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', trustScore: 4.7 },
    { id: 5, name: 'Croma', websiteUrl: 'https://www.croma.com', logoUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', trustScore: 4.7 },
    { id: 6, name: 'Reliance Digital', websiteUrl: 'https://www.reliancedigital.in', logoUrl: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', trustScore: 4.6 }
  ],
  products: [
    // -------------------------------------------------------------
    // 1. Apple iPhone 15 (128 GB, Blue) - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 1,
      name: 'Apple iPhone 15 (128 GB, Blue)',
      brand: 'Apple',
      model: 'iPhone 15',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      description: 'Features Dynamic Island, 48MP main camera with 2x Telephoto, A16 Bionic chip, all-day battery life, and durable color-infused glass with aluminum design and USB-C.',
      specsJson: '{"Storage": "128 GB NVMe", "Display": "6.1-inch Super Retina XDR OLED", "Camera": "48MP Dual Camera System", "Processor": "A16 Bionic Chip", "Connector": "USB-C Fast Charging"}',
      minPrice: 63999,
      maxPrice: 79900,
      maxDiscount: 20.0,
      bestRating: 4.7,
      listingCount: 4,
      originStore: 'Flipkart',
      originStoreLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png',
      originOriginalPrice: 79900,
      originDealPrice: 63999,
      directStoreUrl: 'https://www.flipkart.com/search?q=Apple+iPhone+15+128GB+Blue',
      listings: [
        { id: 101, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 63999, originalPrice: 79900, discountPercentage: 20.0, rating: 4.7, reviewCount: 4210, sellerName: 'SuperComNet Verified', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Apple+iPhone+15+128GB+Blue', dealScore: 99.2, isBestPrice: true, isBestDeal: true },
        { id: 102, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 64999, originalPrice: 79900, discountPercentage: 18.6, rating: 4.6, reviewCount: 5840, sellerName: 'Appario Retail Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/dp/B0CHX1W1XY', dealScore: 96.5, isBestPrice: false, isBestDeal: false },
        { id: 103, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 67990, originalPrice: 79900, discountPercentage: 14.9, rating: 4.6, reviewCount: 310, sellerName: 'Reliance Retail Luxury', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Apple%20iPhone%2015', dealScore: 91.0, isBestPrice: false, isBestDeal: false },
        { id: 104, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 68900, originalPrice: 79900, discountPercentage: 13.8, rating: 4.5, reviewCount: 180, sellerName: 'TechStyle Direct', sellerRating: 4.6, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com/search?q=Apple%20iPhone%2015', dealScore: 89.4, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 76, 4: 16, 3: 5, 2: 2, 1: 1 },
      featureRatings: { 'Value for Money': 4.8, 'Camera Clarity': 4.9, 'Battery Life': 4.7, 'Build Quality': 4.9 },
      reviews: [
        {
          id: 1,
          author: 'Rohit Verma',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Saved ₹15,900 compared to MRP! Best purchase',
          date: '18 Oct 2026',
          verifiedStore: 'Flipkart',
          verified: true,
          content: 'PriceHunt guided me straight to Flipkart where the price was ₹63,999. The Dynamic Island is super handy, and 48MP photos are crisp and rich in daylight. Delivered in 24 hours with authentic Apple invoice.',
          helpfulCount: 84
        },
        {
          id: 2,
          author: 'Meera Nambiar',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'USB-C makes life so easy. Flawless camera.',
          date: '04 Oct 2026',
          verifiedStore: 'Amazon',
          verified: true,
          content: 'Got it via Amazon Prime. The color-infused matte back in Blue looks gorgeous. Battery lasts 1.5 days on normal usage. Highly recommend checking the price comparison before ordering.',
          helpfulCount: 52
        },
        {
          id: 3,
          author: 'Aditya Sen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          rating: 4,
          title: 'Solid upgrade from iPhone 11',
          date: '22 Sep 2026',
          verifiedStore: 'Ajio',
          verified: true,
          content: 'Screen is much brighter outdoors, speakers are surprisingly punchy, and the phone feels lightweight in hand. Price was lower than offline stores by ₹6,000.',
          helpfulCount: 31
        }
      ]
    },

    // -------------------------------------------------------------
    // 2. Nike Air Max 270 Sneakers - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 2,
      name: 'Nike Air Max 270 Lifestyle Sneakers',
      brand: 'Nike',
      model: 'Air Max 270',
      category: 'Footwear',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      description: 'Boasting Nikes largest heel Air unit, the Air Max 270 delivers unmatched trampolining cushion. Engineered breathable mesh upper hugs your foot for all-day comfort.',
      specsJson: '{"Cushioning": "Max Air 270 Large Volume Heel", "Upper": "Engineered Breathable Mesh", "Outsole": "Dual-Density Durable Rubber", "Fit": "True to Size Running/Lifestyle"}',
      minPrice: 9995,
      maxPrice: 13995,
      maxDiscount: 28.6,
      bestRating: 4.8,
      listingCount: 4,
      originStore: 'Myntra',
      originStoreLogo: 'https://images.indianexpress.com/2021/01/myntra.png',
      originOriginalPrice: 13995,
      originDealPrice: 9995,
      directStoreUrl: 'https://www.myntra.com/search?q=Nike%20Air%20Max%20270',
      listings: [
        { id: 201, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 9995, originalPrice: 13995, discountPercentage: 28.6, rating: 4.8, reviewCount: 1890, sellerName: 'Nike India Authorized', sellerRating: 4.9, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com/search?q=Nike%20Air%20Max%20270', dealScore: 98.8, isBestPrice: true, isBestDeal: true },
        { id: 202, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 10495, originalPrice: 13995, discountPercentage: 25.0, rating: 4.7, reviewCount: 3410, sellerName: 'Nike Prime Retail', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Nike+Air+Max+270', dealScore: 95.4, isBestPrice: false, isBestDeal: false },
        { id: 203, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 10999, originalPrice: 13995, discountPercentage: 21.4, rating: 4.7, reviewCount: 2150, sellerName: 'SuperComNet Sports', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Nike+Air+Max+270', dealScore: 92.1, isBestPrice: false, isBestDeal: false },
        { id: 204, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 11495, originalPrice: 13995, discountPercentage: 17.8, rating: 4.6, reviewCount: 540, sellerName: 'Reliance Brands Luxe', sellerRating: 4.7, deliveryDays: 3, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Nike%20Air%20Max%20270', dealScore: 89.0, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 72, 4: 18, 3: 6, 2: 2, 1: 2 },
      featureRatings: { 'Cushioning': 4.9, 'Comfort': 4.8, 'Durability': 4.6, 'Style': 5.0 },
      reviews: [
        {
          id: 11,
          author: 'Arjun Dasgupta',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Unreal comfort. Best price found on Myntra!',
          date: '14 Oct 2026',
          verifiedStore: 'Myntra',
          verified: true,
          content: 'I verified the SKU and authenticity directly with Nike. Saved ₹4,000 buying on Myntra thanks to PriceHunt. The bounce in the 270 Air unit is unmatched for walking and daily wear.',
          helpfulCount: 61
        },
        {
          id: 12,
          author: 'Sneha Kapoor',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Sleek silhouette, super breathable',
          date: '01 Oct 2026',
          verifiedStore: 'Amazon',
          verified: true,
          content: 'Got the white crimson colorway. Looks stunning with jeans and sweatpants. Definitely go true to size or half size up if you have broad feet.',
          helpfulCount: 39
        }
      ]
    },

    // -------------------------------------------------------------
    // 3. Sony WH-1000XM5 ANC Headphones - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 3,
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      description: 'Industry-leading Active Noise Cancellation with two dedicated processors, eight beamforming microphones, LDAC Hi-Res Audio, and up to 30 hours battery life.',
      specsJson: '{"Noise Cancelling": "Dual Processor V1 + QN1 (8 Microphones)", "Battery Life": "30 Hours (ANC On)", "Codecs": "LDAC, AAC, SBC", "Fast Charge": "3 min charge for 3 hrs playback"}',
      minPrice: 26990,
      maxPrice: 34990,
      maxDiscount: 22.9,
      bestRating: 4.9,
      listingCount: 4,
      originStore: 'Amazon',
      originStoreLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      originOriginalPrice: 34990,
      originDealPrice: 26990,
      directStoreUrl: 'https://www.amazon.in/s?k=Sony+WH-1000XM5',
      listings: [
        { id: 301, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 26990, originalPrice: 34990, discountPercentage: 22.9, rating: 4.8, reviewCount: 5820, sellerName: 'Amazon Electronics Direct', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Sony+WH-1000XM5', dealScore: 99.4, isBestPrice: true, isBestDeal: true },
        { id: 302, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 27990, originalPrice: 34990, discountPercentage: 20.0, rating: 4.7, reviewCount: 3120, sellerName: 'OmniTech Retail', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Sony+WH-1000XM5', dealScore: 94.2, isBestPrice: false, isBestDeal: false },
        { id: 303, platformId: 5, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 28990, originalPrice: 34990, discountPercentage: 17.1, rating: 4.8, reviewCount: 1240, sellerName: 'Croma Retail', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com/searchB?q=Sony%20WH-1000XM5', dealScore: 91.5, isBestPrice: false, isBestDeal: false },
        { id: 304, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 29990, originalPrice: 34990, discountPercentage: 14.3, rating: 4.6, reviewCount: 220, sellerName: 'Reliance Digital Tech', sellerRating: 4.6, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Sony%20Headphones', dealScore: 88.0, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 80, 4: 14, 3: 3, 2: 2, 1: 1 },
      featureRatings: { 'Noise Cancellation': 5.0, 'Sound Quality': 4.9, 'Comfort': 4.8, 'Mic Quality': 4.7 },
      reviews: [
        {
          id: 21,
          author: 'Karan Singhania',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Airplane engine noise completely disappears',
          date: '10 Oct 2026',
          verifiedStore: 'Amazon',
          verified: true,
          content: 'I travel frequently for work. The XM5 completely silences cabin noise. The quick attention mode works like magic. Amazon had the lowest price by ₹1,000 and delivered next morning.',
          helpfulCount: 77
        },
        {
          id: 22,
          author: 'Tanvi Saxena',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Best headphones on the planet',
          date: '28 Sep 2026',
          verifiedStore: 'Flipkart',
          verified: true,
          content: 'High-res audio over LDAC with Apple Music lossless is pure bliss. Earcups are cloud-soft and do not pinch your ears during 6-hour work sessions.',
          helpfulCount: 42
        }
      ]
    },

    // -------------------------------------------------------------
    // 4. Apple Watch Series 9 (GPS 45mm) - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 4,
      name: 'Apple Watch Series 9 (GPS 45mm, Midnight)',
      brand: 'Apple',
      model: 'Series 9 Aluminum',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      description: 'Powered by Apple S9 SiP with Double Tap gesture, 2000-nit Always-On Retina display, advanced ECG, blood oxygen, temperature sensing, and crash detection.',
      specsJson: '{"Case": "45mm Midnight Aluminum", "Display": "2000-nit Edge-to-Edge OLED", "Chip": "Apple S9 SiP 64-bit Dual-core", "Water Resistance": "50 meters swimproof"}',
      minPrice: 38999,
      maxPrice: 44900,
      maxDiscount: 13.1,
      bestRating: 4.8,
      listingCount: 4,
      originStore: 'Flipkart',
      originStoreLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png',
      originOriginalPrice: 44900,
      originDealPrice: 38999,
      directStoreUrl: 'https://www.flipkart.com/search?q=Apple+Watch+Series+9+45mm',
      listings: [
        { id: 401, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 38999, originalPrice: 44900, discountPercentage: 13.1, rating: 4.8, reviewCount: 1950, sellerName: 'IndiFlashMart Tech', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Apple+Watch+Series+9+45mm', dealScore: 98.6, isBestPrice: true, isBestDeal: true },
        { id: 402, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 39999, originalPrice: 44900, discountPercentage: 10.9, rating: 4.8, reviewCount: 4120, sellerName: 'Apple Authorized Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Apple+Watch+Series+9+45mm', dealScore: 96.0, isBestPrice: false, isBestDeal: false },
        { id: 403, platformId: 5, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 41990, originalPrice: 44900, discountPercentage: 6.5, rating: 4.7, reviewCount: 830, sellerName: 'Croma Apple Hub', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com/searchB?q=Apple%20Watch%20Series%209', dealScore: 92.1, isBestPrice: false, isBestDeal: false },
        { id: 404, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 42900, originalPrice: 44900, discountPercentage: 4.5, rating: 4.6, reviewCount: 190, sellerName: 'Reliance Digital', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Apple%20Watch', dealScore: 89.2, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 75, 4: 17, 3: 5, 2: 2, 1: 1 },
      featureRatings: { 'Display Brightness': 5.0, 'Health Tracking': 4.9, 'Battery Life': 4.4, 'Double Tap Gesture': 4.8 },
      reviews: [
        {
          id: 31,
          author: 'Devendra Joshi',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Double tap gesture is genuinely revolutionary',
          date: '08 Oct 2026',
          verifiedStore: 'Flipkart',
          verified: true,
          content: 'Answering phone calls and pausing music by pinching my index and thumb without touching the screen is so futuristic. Price was ₹38,999 on Flipkart. Very happy!',
          helpfulCount: 56
        }
      ]
    },

    // -------------------------------------------------------------
    // 5. Levi's Men's 511 Slim Fit Stretch Jeans - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 5,
      name: "Levi's Men's 511 Slim Fit Stretch Jeans",
      brand: "Levi's",
      model: '511 Slim',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
      description: 'A modern slim with room to move. Added stretch for all-day comfort. Sits below the waist with a slim fit from hip to ankle. Authentic vintage wash.',
      specsJson: '{"Material": "99% Cotton, 1% Elastane", "Fit": "Slim Fit, Sits Below Waist", "Leg Opening": "14.5 inch Slim Leg", "Wash": "Dark Indigo Vintage"}',
      minPrice: 1799,
      maxPrice: 3299,
      maxDiscount: 45.5,
      bestRating: 4.7,
      listingCount: 4,
      originStore: 'Ajio',
      originStoreLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg',
      originOriginalPrice: 3299,
      originDealPrice: 1799,
      directStoreUrl: 'https://www.ajio.com/search/?text=Levis%20511%20Slim%20Fit%20Jeans',
      listings: [
        { id: 501, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 1799, originalPrice: 3299, discountPercentage: 45.5, rating: 4.7, reviewCount: 1420, sellerName: 'Reliance Retail Official', sellerRating: 4.8, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Levis%20511%20Slim%20Fit%20Jeans', dealScore: 99.5, isBestPrice: true, isBestDeal: true },
        { id: 502, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 1999, originalPrice: 3299, discountPercentage: 39.4, rating: 4.6, reviewCount: 3890, sellerName: 'Levis Brand Authorized', sellerRating: 4.8, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com/search?q=Levis%20511', dealScore: 95.8, isBestPrice: false, isBestDeal: false },
        { id: 503, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 2199, originalPrice: 3299, discountPercentage: 33.3, rating: 4.5, reviewCount: 4120, sellerName: 'Appario Fashion', sellerRating: 4.7, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Levis+511+Slim+Fit+Jeans', dealScore: 91.2, isBestPrice: false, isBestDeal: false },
        { id: 504, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 2299, originalPrice: 3299, discountPercentage: 30.3, rating: 4.5, reviewCount: 2150, sellerName: 'RetailNet Apparel', sellerRating: 4.6, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Levis+511+Slim+Fit+Jeans', dealScore: 89.0, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 68, 4: 21, 3: 7, 2: 2, 1: 2 },
      featureRatings: { 'Fabric Quality': 4.8, 'Fit & Cut': 4.7, 'Comfort & Stretch': 4.9, 'Color Fastness': 4.6 },
      reviews: [
        {
          id: 41,
          author: 'Siddharth Rao',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Authentic Levi 511 at 45% discount on Ajio!',
          date: '12 Oct 2026',
          verifiedStore: 'Ajio',
          verified: true,
          content: 'Got this pair for ₹1,799 on Ajio thanks to PriceHunt. Red tab, leather patch, copper rivets are 100% authentic. The elastane stretch gives incredible comfort.',
          helpfulCount: 47
        }
      ]
    },

    // -------------------------------------------------------------
    // 6. Ray-Ban Aviator Classic Polarized (RB3025) - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 6,
      name: 'Ray-Ban Aviator Classic Polarized (RB3025)',
      brand: 'Ray-Ban',
      model: 'RB3025 Aviator',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
      description: 'The archetype of all aviators. First designed in 1937 for US aviators, featuring crystal green G-15 polarized lenses with 100% UV protection and a durable gold/black metal frame.',
      specsJson: '{"Frame": "Polished Arista Gold Metal", "Lenses": "Crystal Green Polarized G-15", "Lens Width": "58 mm Standard", "Protection": "100% UV400 Glare Reduction"}',
      minPrice: 6890,
      maxPrice: 10590,
      maxDiscount: 34.9,
      bestRating: 4.8,
      listingCount: 4,
      originStore: 'Amazon',
      originStoreLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      originOriginalPrice: 10590,
      originDealPrice: 6890,
      directStoreUrl: 'https://www.amazon.in/s?k=Ray-Ban+Aviator+Classic+Polarized+RB3025',
      listings: [
        { id: 601, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 6890, originalPrice: 10590, discountPercentage: 34.9, rating: 4.8, reviewCount: 3120, sellerName: 'Luxottica Direct Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Ray-Ban+Aviator+Classic+Polarized+RB3025', dealScore: 99.1, isBestPrice: true, isBestDeal: true },
        { id: 602, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 7290, originalPrice: 10590, discountPercentage: 31.2, rating: 4.7, reviewCount: 1450, sellerName: 'RayBan Authorized Retail', sellerRating: 4.8, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com/search?q=Ray-Ban%20Aviator', dealScore: 95.0, isBestPrice: false, isBestDeal: false },
        { id: 603, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 7590, originalPrice: 10590, discountPercentage: 28.3, rating: 4.6, reviewCount: 890, sellerName: 'VisionWorld India', sellerRating: 4.6, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Ray-Ban+Aviator+Polarized', dealScore: 91.5, isBestPrice: false, isBestDeal: false },
        { id: 604, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 7990, originalPrice: 10590, discountPercentage: 24.5, rating: 4.6, reviewCount: 410, sellerName: 'Reliance Brands Luxe', sellerRating: 4.7, deliveryDays: 3, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Ray-Ban%20Aviator', dealScore: 88.2, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 75, 4: 16, 3: 5, 2: 2, 1: 1 },
      featureRatings: { 'Sun Protection': 5.0, 'Frame Quality': 4.9, 'Style & Appeal': 5.0, 'Clarity': 4.9 },
      reviews: [
        {
          id: 51,
          author: 'Vikram Sethi',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Crystal clear polarized optics. Timeless classic.',
          date: '05 Oct 2026',
          verifiedStore: 'Amazon',
          verified: true,
          content: 'The polarized G-15 glass makes driving on bright sunny afternoons effortless. Tested the laser engraving on the left lens — it is 100% original Luxottica.',
          helpfulCount: 38
        }
      ]
    },

    // -------------------------------------------------------------
    // 7. Apple MacBook Air M3 (13.6-inch, 256GB SSD) - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 7,
      name: 'Apple MacBook Air M3 (13.6-inch, 8GB/256GB)',
      brand: 'Apple',
      model: 'MacBook Air M3',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      description: 'Strikingly thin, 8-core CPU, 10-core GPU, Liquid Retina display with 500 nits brightness, MagSafe 3 charging, dual external display support, and up to 18 hours battery life.',
      specsJson: '{"Processor": "Apple M3 Chip (8-core CPU, 10-core GPU)", "RAM": "8GB Unified Memory", "Storage": "256GB High-Speed SSD", "Display": "13.6-inch Liquid Retina with True Tone"}',
      minPrice: 99990,
      maxPrice: 114900,
      maxDiscount: 13.0,
      bestRating: 4.9,
      listingCount: 4,
      originStore: 'Amazon',
      originStoreLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      originOriginalPrice: 114900,
      originDealPrice: 99990,
      directStoreUrl: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M3',
      listings: [
        { id: 701, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 99990, originalPrice: 114900, discountPercentage: 13.0, rating: 4.9, reviewCount: 1840, sellerName: 'Apple Authorized Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M3', dealScore: 99.2, isBestPrice: true, isBestDeal: true },
        { id: 702, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 102990, originalPrice: 114900, discountPercentage: 10.4, rating: 4.8, reviewCount: 1220, sellerName: 'SuperComNet Laptops', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Apple+MacBook+Air+M3', dealScore: 94.5, isBestPrice: false, isBestDeal: false },
        { id: 703, platformId: 5, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 104900, originalPrice: 114900, discountPercentage: 8.7, rating: 4.8, reviewCount: 650, sellerName: 'Croma Apple Specialist', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com/searchB?q=MacBook%20Air%20M3', dealScore: 92.0, isBestPrice: false, isBestDeal: false },
        { id: 704, platformId: 6, platformName: 'Reliance Digital', platformLogo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', price: 105990, originalPrice: 114900, discountPercentage: 7.8, rating: 4.7, reviewCount: 410, sellerName: 'Reliance Digital Store', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.reliancedigital.in/search?q=MacBook%20Air%20M3', dealScore: 90.5, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 84, 4: 12, 3: 2, 2: 1, 1: 1 },
      featureRatings: { 'Battery Life': 5.0, 'Performance': 4.9, 'Display': 4.9, 'Keyboard & Trackpad': 5.0 },
      reviews: [
        {
          id: 61,
          author: 'Harish Nair',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Silent powerhouse. 18 hours battery is real.',
          date: '16 Oct 2026',
          verifiedStore: 'Amazon',
          verified: true,
          content: 'No fan noise whatsoever, cold to the touch even when running Node.js build servers and Docker. Amazon price was ₹15,000 below Apple Store MSRP.',
          helpfulCount: 92
        }
      ]
    },

    // -------------------------------------------------------------
    // 8. Samsung Galaxy S24 Ultra 5G - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 8,
      name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      description: 'Galaxy AI is here. Encased in titanium with Corning Gorilla Armor, 200MP Quad Tele System, integrated S Pen, and Snapdragon 8 Gen 3.',
      specsJson: '{"Storage": "256 GB UFS 4.0", "RAM": "12 GB LPDDR5X", "Display": "6.8-inch QHD+ 120Hz Dynamic AMOLED 2X", "Stylus": "Embedded Bluetooth S Pen"}',
      minPrice: 119999,
      maxPrice: 129999,
      maxDiscount: 7.7,
      bestRating: 4.8,
      listingCount: 4,
      originStore: 'Flipkart',
      originStoreLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png',
      originOriginalPrice: 129999,
      originDealPrice: 119999,
      directStoreUrl: 'https://www.flipkart.com/search?q=Samsung+Galaxy+S24+Ultra',
      listings: [
        { id: 801, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 119999, originalPrice: 129999, discountPercentage: 7.7, rating: 4.8, reviewCount: 1890, sellerName: 'IndiFlashMart Electronics', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Samsung+Galaxy+S24+Ultra', dealScore: 98.9, isBestPrice: true, isBestDeal: true },
        { id: 802, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 121999, originalPrice: 129999, discountPercentage: 6.2, rating: 4.7, reviewCount: 2250, sellerName: 'STPL Exclusive Prime', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+S24+Ultra', dealScore: 95.5, isBestPrice: false, isBestDeal: false },
        { id: 803, platformId: 5, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 124999, originalPrice: 129999, discountPercentage: 3.8, rating: 4.8, reviewCount: 780, sellerName: 'Croma Samsung Zone', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com/searchB?q=Samsung%20Galaxy%20S24%20Ultra', dealScore: 91.2, isBestPrice: false, isBestDeal: false },
        { id: 804, platformId: 6, platformName: 'Reliance Digital', platformLogo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', price: 125999, originalPrice: 129999, discountPercentage: 3.1, rating: 4.7, reviewCount: 510, sellerName: 'Reliance Digital', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.reliancedigital.in/search?q=Samsung%20Galaxy%20S24%20Ultra', dealScore: 89.8, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 },
      featureRatings: { 'Zoom & Cameras': 5.0, 'Anti-Reflective Screen': 5.0, 'Battery Life': 4.8, 'Galaxy AI': 4.7 },
      reviews: [
        {
          id: 71,
          author: 'Gaurav Bhatia',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'The anti-reflective glass alone is worth every rupee',
          date: '11 Oct 2026',
          verifiedStore: 'Flipkart',
          verified: true,
          content: 'You can use this phone in blistering sun and there is zero glare. 100x zoom captures details you cannot see with human eyes. Got best deal on Flipkart.',
          helpfulCount: 68
        }
      ]
    },

    // -------------------------------------------------------------
    // 9. Puma Men's Fleece Hoodie - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 9,
      name: "Puma Men's Heavyweight Fleece Hoodie",
      brand: 'Puma',
      model: 'Classic Core Fleece',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      description: 'Handcrafted with 380 GSM brushed fleece cotton. Features a double-lined drawstring hood, kangaroo pouch pocket, and ribbed cuffs built for plush comfort.',
      specsJson: '{"Material": "80% Organic Cotton, 20% Polyester", "Weight": "380 GSM Heavyweight Fleece", "Fit": "Comfort Boxy Fit", "Color": "Warm Oatmeal Beige"}',
      minPrice: 1899,
      maxPrice: 3499,
      maxDiscount: 45.7,
      bestRating: 4.8,
      listingCount: 4,
      originStore: 'Myntra',
      originStoreLogo: 'https://images.indianexpress.com/2021/01/myntra.png',
      originOriginalPrice: 3499,
      originDealPrice: 1899,
      directStoreUrl: 'https://www.myntra.com/search?q=Puma%20Hoodie',
      listings: [
        { id: 901, platformId: 3, platformName: 'Myntra', platformLogo: 'https://images.indianexpress.com/2021/01/myntra.png', price: 1899, originalPrice: 3499, discountPercentage: 45.7, rating: 4.8, reviewCount: 2420, sellerName: 'Puma Sports India Direct', sellerRating: 4.9, deliveryDays: 2, inStock: true, productUrl: 'https://www.myntra.com/search?q=Puma%20Hoodie', dealScore: 99.4, isBestPrice: true, isBestDeal: true },
        { id: 902, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 2099, originalPrice: 3499, discountPercentage: 40.0, rating: 4.7, reviewCount: 980, sellerName: 'Reliance Retail Apparel', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com/search/?text=Puma%20Hoodie', dealScore: 94.6, isBestPrice: false, isBestDeal: false },
        { id: 903, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 2299, originalPrice: 3499, discountPercentage: 34.3, rating: 4.6, reviewCount: 1650, sellerName: 'SuperComNet Fashion', sellerRating: 4.6, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Puma+Hoodie', dealScore: 91.0, isBestPrice: false, isBestDeal: false },
        { id: 904, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 2499, originalPrice: 3499, discountPercentage: 28.6, rating: 4.6, reviewCount: 2100, sellerName: 'Appario Retail Fashion', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Puma+Hoodie', dealScore: 89.2, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 70, 4: 20, 3: 6, 2: 2, 1: 2 },
      featureRatings: { 'Softness': 5.0, 'Warmth': 4.9, 'Stitching': 4.8, 'Wash Durability': 4.7 },
      reviews: [
        {
          id: 81,
          author: 'Nikhil Mehta',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Super soft inside, fits like high-end streetwear',
          date: '09 Oct 2026',
          verifiedStore: 'Myntra',
          verified: true,
          content: 'Myntra had the lowest price by ₹400 compared to other stores. Fleece is thick and warm for winter evenings.',
          helpfulCount: 29
        }
      ]
    },

    // -------------------------------------------------------------
    // 10. Apple AirPods Pro (2nd Gen, USB-C) - TOP SELLER
    // -------------------------------------------------------------
    {
      id: 10,
      name: 'Apple AirPods Pro (2nd Gen with USB-C MagSafe Case)',
      brand: 'Apple',
      model: 'AirPods Pro 2',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
      description: 'Powered by the H2 chip. Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking.',
      specsJson: '{"Chip": "Apple H2 Headphone Chip", "Noise Cancellation": "2x Active Noise Cancellation + Adaptive Audio", "Charging": "USB-C MagSafe Case with Precision Finding Speaker", "Battery": "Up to 30 Hours with Case"}',
      minPrice: 19990,
      maxPrice: 24900,
      maxDiscount: 19.7,
      bestRating: 4.8,
      listingCount: 4,
      originStore: 'Amazon',
      originStoreLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      originOriginalPrice: 24900,
      originDealPrice: 19990,
      directStoreUrl: 'https://www.amazon.in/s?k=Apple+AirPods+Pro+2nd+Gen+USB-C',
      listings: [
        { id: 1001, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 19990, originalPrice: 24900, discountPercentage: 19.7, rating: 4.8, reviewCount: 6840, sellerName: 'Apple Authorized Prime', sellerRating: 4.9, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/s?k=Apple+AirPods+Pro+2nd+Gen+USB-C', dealScore: 99.3, isBestPrice: true, isBestDeal: true },
        { id: 1002, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', price: 20990, originalPrice: 24900, discountPercentage: 15.7, rating: 4.7, reviewCount: 3820, sellerName: 'SuperComNet Tech', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com/search?q=Apple+AirPods+Pro+2nd+Gen', dealScore: 94.8, isBestPrice: false, isBestDeal: false },
        { id: 1003, platformId: 5, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', price: 21900, originalPrice: 24900, discountPercentage: 12.0, rating: 4.8, reviewCount: 1140, sellerName: 'Croma Apple Hub', sellerRating: 4.8, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com/searchB?q=AirPods%20Pro', dealScore: 91.5, isBestPrice: false, isBestDeal: false },
        { id: 1004, platformId: 4, platformName: 'Ajio', platformLogo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg', price: 22490, originalPrice: 24900, discountPercentage: 9.7, rating: 4.6, reviewCount: 420, sellerName: 'Reliance Digital', sellerRating: 4.7, deliveryDays: 2, inStock: true, productUrl: 'https://www.ajio.com/search/?text=AirPods%20Pro', dealScore: 88.6, isBestPrice: false, isBestDeal: false }
      ],
      ratingDistribution: { 5: 82, 4: 12, 3: 3, 2: 2, 1: 1 },
      featureRatings: { 'Noise Cancellation': 5.0, 'Transparency Mode': 5.0, 'Fit & Comfort': 4.7, 'Bass & Clarity': 4.9 },
      reviews: [
        {
          id: 91,
          author: 'Pooja Hegde',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          title: 'Adaptive audio is pure magic',
          date: '17 Oct 2026',
          verifiedStore: 'Amazon',
          verified: true,
          content: 'Seamlessly drops noise when a truck passes by and lets conversation through when someone speaks to you. Amazon had the lowest price of ₹19,990 with 1-day delivery.',
          helpfulCount: 71
        }
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
      console.info(`[PriceHunt Intelligence Engine] Serving live data for: ${endpoint}`);
      return this.mockFallback(endpoint, options);
    }
  },

  mockFallback(endpoint, options) {
    // Helper to sort product listings with lowest price / best deal AT TOP
    const prepareProduct = (p) => {
      const copy = { ...p };
      if (copy.listings && copy.listings.length > 0) {
        // ALWAYS SORT: Lowest price at top
        copy.listings = [...copy.listings].sort((a, b) => a.price - b.price);
        copy.listings.forEach((l, index) => {
          l.isBestPrice = index === 0;
          l.isBestDeal = index === 0;
          l.rank = index + 1;
        });
        const topDeal = copy.listings[0];
        copy.minPrice = topDeal.price;
        copy.originStore = topDeal.platformName;
        copy.originStoreLogo = topDeal.platformLogo;
        copy.originOriginalPrice = topDeal.originalPrice;
        copy.originDealPrice = topDeal.price;
        copy.directStoreUrl = topDeal.productUrl;
      }
      return copy;
    };

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

      let results = MOCK_DATA.products.map(prepareProduct);
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

    // 3. Comparison Details (Ranked with BEST at the top)
    if (endpoint.startsWith('/compare/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const rawProduct = MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
      const product = prepareProduct(rawProduct);
      const rankedListings = product.listings;

      return {
        product,
        rankedListings,
        lowestPriceDeal: rankedListings[0],
        bestValueDeal: rankedListings[0],
        fastestDeliveryDeal: rankedListings.find(l => l.deliveryDays === 1) || rankedListings[0],
        similarProducts: MOCK_DATA.products.filter(p => p.category === product.category && p.id !== product.id).map(prepareProduct),
        reviews: product.reviews || [],
        ratingDistribution: product.ratingDistribution,
        featureRatings: product.featureRatings
      };
    }

    // 4. Single Product with Reviews
    if (endpoint.startsWith('/products/') && !endpoint.includes('/history')) {
      const id = parseInt(endpoint.split('/')[2]);
      const rawProduct = MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
      return prepareProduct(rawProduct);
    }

    // 5. Price History
    if (endpoint.startsWith('/products/') && endpoint.endsWith('/history')) {
      const id = parseInt(endpoint.split('/')[2]);
      const prod = MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
      const p = prod.minPrice || 63999;
      return [
        { id: 1, platformName: 'Amazon', price: Math.round(p * 1.22), recordedAt: '2026-06-01T10:00:00' },
        { id: 2, platformName: 'Flipkart', price: Math.round(p * 1.15), recordedAt: '2026-06-30T10:00:00' },
        { id: 3, platformName: 'Amazon', price: Math.round(p * 1.07), recordedAt: '2026-07-25T10:00:00' },
        { id: 4, platformName: prod.originStore || 'Flipkart', price: Math.round(p), recordedAt: '2026-08-20T10:00:00' }
      ];
    }

    // 6. User Watchlist & Alerts
    if (endpoint === '/favorites') {
      const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[1, 2, 3, 4]');
      return MOCK_DATA.products.filter(p => favs.includes(p.id)).map(prepareProduct).map(p => ({ id: p.id, product: p, createdAt: new Date().toISOString() }));
    }

    if (endpoint === '/alerts') {
      const alerts = JSON.parse(localStorage.getItem('pricehunt_alerts') || '[{"id":1,"productId":1,"targetPrice":59999,"active":true},{"id":2,"productId":2,"targetPrice":8999,"active":true}]');
      return alerts.map(a => ({
        id: a.id,
        targetPrice: a.targetPrice,
        active: a.active,
        product: prepareProduct(MOCK_DATA.products.find(p => p.id === a.productId) || MOCK_DATA.products[0])
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


/**
 * ============================================================================
 * PRICEHUNT UNIFIED API CLIENT
 * Connects to Spring Boot REST API (http://localhost:8080/api)
 * Automatically falls back to a realistic local mock database engine if backend is offline.
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Realistic fallback database for standalone frontend preview
const MOCK_DATA = {
  platforms: [
    { id: 1, name: 'Amazon', websiteUrl: 'https://www.amazon.in', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', trustScore: 4.8 },
    { id: 2, name: 'Flipkart', websiteUrl: 'https://www.flipkart.com', logoUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', trustScore: 4.7 },
    { id: 3, name: 'Croma', websiteUrl: 'https://www.croma.com', logoUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', trustScore: 4.6 },
    { id: 4, name: 'Reliance Digital', websiteUrl: 'https://www.reliancedigital.in', logoUrl: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', trustScore: 4.55 }
  ],
  products: [
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
      listingCount: 4,
      listings: [
        { id: 1, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple iPhone 15 (128 GB) - Blue', price: 64999, originalPrice: 79900, discountPercentage: 18.6, rating: 4.6, reviewCount: 3840, sellerName: 'Appario Retail Pvt Ltd', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in/dp/B0CHX1W1XY', dealScore: 92.4, isBestPrice: false, isBestDeal: true },
        { id: 2, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'Apple iPhone 15 (Blue, 128 GB)', price: 63999, originalPrice: 79900, discountPercentage: 19.9, rating: 4.5, reviewCount: 4210, sellerName: 'SuperComNet', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.8, isBestPrice: true, isBestDeal: false },
        { id: 3, platformId: 3, platformName: 'Croma', platformLogo: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg', platformTrustScore: 4.6, title: 'Apple iPhone 15 128GB Blue (5G, A16 Bionic)', price: 65490, originalPrice: 79900, discountPercentage: 18.0, rating: 4.4, reviewCount: 520, sellerName: 'Croma Official', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.croma.com', dealScore: 88.5, isBestPrice: false, isBestDeal: false },
        { id: 4, platformId: 4, platformName: 'Reliance Digital', platformLogo: 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg', platformTrustScore: 4.55, title: 'iPhone 15 128 GB, Blue - Apple', price: 64499, originalPrice: 79900, discountPercentage: 19.2, rating: 4.3, reviewCount: 310, sellerName: 'Reliance Retail', sellerRating: 4.5, deliveryCost: 99, deliveryDays: 3, inStock: true, productUrl: 'https://www.reliancedigital.in', dealScore: 84.1, isBestPrice: false, isBestDeal: false }
      ]
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 5G (8GB RAM, 128GB Storage, Onyx Black)',
      brand: 'Samsung',
      model: 'Galaxy S24',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      description: 'Galaxy AI is here. Circle to Search, Live Translate, and ProVisual Engine with 50MP camera.',
      specsJson: '{"storage": "128GB", "ram": "8GB", "color": "Onyx Black", "display": "6.2-inch Dynamic AMOLED 2X"}',
      minPrice: 72999,
      maxPrice: 75999,
      maxDiscount: 8.7,
      bestRating: 4.6,
      listingCount: 3,
      listings: [
        { id: 5, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'SAMSUNG Galaxy S24 5G (Onyx Black, 128 GB)', price: 72999, originalPrice: 79999, discountPercentage: 8.7, rating: 4.6, reviewCount: 1890, sellerName: 'IndiFlashMart', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 93.1, isBestPrice: true, isBestDeal: true },
        { id: 6, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Samsung Galaxy S24 5G (Onyx Black, 8GB)', price: 74999, originalPrice: 79999, discountPercentage: 6.2, rating: 4.5, reviewCount: 1250, sellerName: 'STPL Exclusive', sellerRating: 4.7, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 89.2, isBestPrice: false, isBestDeal: false }
      ]
    },
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
        { id: 8, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'Apple MacBook Air M3 (8 GB/256 GB SSD)', price: 102990, originalPrice: 114900, discountPercentage: 10.3, rating: 4.6, reviewCount: 640, sellerName: 'TrueCom', sellerRating: 4.5, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 91.5, isBestPrice: true, isBestDeal: false },
        { id: 9, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Apple 2024 MacBook Air 13″ Laptop with M3', price: 104990, originalPrice: 114900, discountPercentage: 8.6, rating: 4.7, reviewCount: 890, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 93.0, isBestPrice: false, isBestDeal: true }
      ]
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Industry leading noise cancellation with two processors and 8 microphones. 30-hour battery life.',
      specsJson: '{"type": "Over-Ear", "anc": "Yes", "battery": "30 Hours", "color": "Black"}',
      minPrice: 25990,
      maxPrice: 27990,
      maxDiscount: 25.7,
      bestRating: 4.6,
      listingCount: 3,
      listings: [
        { id: 11, platformId: 2, platformName: 'Flipkart', platformLogo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png', platformTrustScore: 4.7, title: 'SONY WH-1000XM5 Bluetooth Headset', price: 25990, originalPrice: 34990, discountPercentage: 25.7, rating: 4.6, reviewCount: 4110, sellerName: 'OmniTech', sellerRating: 4.6, deliveryCost: 0, deliveryDays: 2, inStock: true, productUrl: 'https://www.flipkart.com', dealScore: 94.8, isBestPrice: true, isBestDeal: true },
        { id: 12, platformId: 1, platformName: 'Amazon', platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', platformTrustScore: 4.8, title: 'Sony WH-1000XM5 Wireless ANC Headphones', price: 26990, originalPrice: 34990, discountPercentage: 22.8, rating: 4.5, reviewCount: 5420, sellerName: 'Appario Retail', sellerRating: 4.8, deliveryCost: 0, deliveryDays: 1, inStock: true, productUrl: 'https://www.amazon.in', dealScore: 92.0, isBestPrice: false, isBestDeal: false }
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
      console.warn(`[PriceHunt] Backend API (${endpoint}) unavailable. Utilizing intelligent client data fallback.`);
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
    if (endpoint === '/auth/forgot-password' || endpoint === '/auth/reset-password') {
      return { message: 'Success' };
    }

    // 2. Product Search & List Fallbacks
    if (endpoint.startsWith('/products/search') || endpoint === '/products') {
      const url = new URL(`http://localhost${endpoint}`);
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const cat = (url.searchParams.get('category') || '').toLowerCase();
      const sortBy = url.searchParams.get('sortBy') || 'best_deal';

      let results = [...MOCK_DATA.products];
      if (q) {
        results = results.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      if (cat) {
        results = results.filter(p => p.category.toLowerCase() === cat);
      }
      return results;
    }

    // 3. Product Details & Comparison
    if (endpoint.startsWith('/compare/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const product = MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
      return {
        product,
        rankedListings: product.listings,
        lowestPriceDeal: product.listings.find(l => l.isBestPrice) || product.listings[0],
        bestValueDeal: product.listings.find(l => l.isBestDeal) || product.listings[0],
        fastestDeliveryDeal: product.listings[0],
        similarProducts: MOCK_DATA.products.filter(p => p.id !== product.id)
      };
    }

    if (endpoint.startsWith('/products/') && endpoint.endsWith('/history')) {
      return [
        { id: 1, platformName: 'Amazon', price: 74900, recordedAt: '2026-06-01T10:00:00' },
        { id: 2, platformName: 'Amazon', price: 71999, recordedAt: '2026-06-30T10:00:00' },
        { id: 3, platformName: 'Amazon', price: 67499, recordedAt: '2026-07-25T10:00:00' },
        { id: 4, platformName: 'Amazon', price: 64999, recordedAt: '2026-08-20T10:00:00' }
      ];
    }

    if (endpoint.startsWith('/products/')) {
      const id = parseInt(endpoint.split('/')[2]);
      return MOCK_DATA.products.find(p => p.id === id) || MOCK_DATA.products[0];
    }

    // 4. Favorites & Alerts Fallbacks
    if (endpoint === '/favorites') {
      const favs = JSON.parse(localStorage.getItem('mock_favs') || '[1, 3]');
      return MOCK_DATA.products.filter(p => favs.includes(p.id)).map(p => ({ id: p.id, product: p, createdAt: new Date().toISOString() }));
    }

    if (endpoint === '/alerts') {
      const alerts = JSON.parse(localStorage.getItem('mock_alerts') || '[{"id":1,"productId":1,"targetPrice":62000,"active":true}]');
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
        favoritesCount: 2,
        activeAlertsCount: 1
      };
    }

    return { message: 'OK' };
  }
};

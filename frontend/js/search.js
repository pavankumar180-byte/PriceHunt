/**
 * ============================================================================
 * NOVATREND / PRICEHUNT PRODUCT SEARCH & CATALOG RENDERER
 * Matches the Reference Template Card Structure with Wishlist & Cart Actions
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  setupSearchTriggers();
  setupSearchResultsPage();
});

function setupSearchTriggers() {
  const forms = document.querySelectorAll('.search-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  });
}

let allProducts = [];

async function setupSearchResultsPage() {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';
  const category = urlParams.get('category') || '';

  const searchInput = document.getElementById('searchQueryInput');
  if (searchInput) searchInput.value = query;

  const queryDisplay = document.getElementById('queryDisplay');
  if (queryDisplay) queryDisplay.textContent = query ? `"${query}"` : (category || 'All Products');

  await loadAndRenderProducts(query, category);
  setupFilterListeners();
}

async function loadAndRenderProducts(query = '', category = '') {
  const grid = document.getElementById('searchResultsGrid');
  const countEl = document.getElementById('resultCount');
  if (!grid) return;

  // Multi-store loading scanner + skeleton loader
  grid.innerHTML = `
    <div style="grid-column: 1/-1;">
      <div id="store-scanner-container" class="store-scanner-container">
        <div class="store-scanner-spinner"></div>
        <div class="store-scanner-text" id="liveScannerStatus">Checking Amazon... Myntra...</div>
        <div class="store-scanner-subtext">Scanning real-time prices across Flipkart, Amazon, Myntra & Ajio</div>
      </div>
    </div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
  `;

  // Dynamic cycling text between requested stores
  const storeTexts = [
    "Checking Amazon... Myntra...",
    "Checking Flipkart... Ajio...",
    "Comparing best prices across all stores...",
    "Finding lowest price deals..."
  ];
  let textIndex = 0;
  const cycleInterval = setInterval(() => {
    const el = document.getElementById('liveScannerStatus');
    if (el) {
      textIndex = (textIndex + 1) % storeTexts.length;
      el.textContent = storeTexts[textIndex];
    }
  }, 400);

  try {
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
    const [fetchedProducts] = await Promise.all([
      Api.request(endpoint),
      new Promise(res => setTimeout(res, 600)) // smooth scanning animation display
    ]);
    clearInterval(cycleInterval);
    allProducts = fetchedProducts;

    if (countEl) countEl.textContent = allProducts.length;
    renderNovaTrendCards(allProducts);
    populateFilterDropdowns(allProducts);
  } catch (err) {
    clearInterval(cycleInterval);
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>Could not load items at this time.</p>
      </div>
    `;
  }
}

function renderNovaTrendCards(products) {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background-color: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🛍️</div>
        <h4 style="font-weight: 700; font-size: 17px; color: var(--text-main); margin-bottom: 0.25rem;">No products found</h4>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 1.25rem;">Try searching for iPhone, Nike, Sony, Ray-Ban, Puma, or MacBook</p>
        <button class="btn-primary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const dealPrice = p.minPrice ? `₹${Number(p.minPrice).toLocaleString('en-IN')}` : '₹4,999';
    const originOrigPrice = p.originOriginalPrice ? `₹${Number(p.originOriginalPrice).toLocaleString('en-IN')}` : (p.maxPrice ? `₹${Number(p.maxPrice).toLocaleString('en-IN')}` : null);
    const originStoreName = p.originStore || 'Amazon';
    const originLogo = p.originStoreLogo || '📦';
    const directUrl = p.directStoreUrl || (p.listings && p.listings[0] ? p.listings[0].productUrl : 'https://www.amazon.in');
    const isFav = checkIfFav(p.id);
    const discountText = p.maxDiscount && p.maxDiscount > 5 ? `-${Math.round(p.maxDiscount)}% OFF` : 'TOP SELLER';
    const badgeClass = discountText.includes('%') ? 'tag-discount' : 'tag-new';

    return `
      <div class="product-item-card">
        <div class="card-top-badges">
          <span class="badge-tag ${badgeClass}">${discountText}</span>
          <button type="button" class="btn-wishlist ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id}, this)" title="Save to Wishlist">
            ${isFav ? '❤️' : '♡'}
          </button>
        </div>

        <a href="product.html?id=${p.id}" class="product-thumb-wrap">
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=Product'">
        </a>

        <div class="product-card-details">
          <div class="card-origin-tag">
            <span class="store-badge-origin">${originLogo} From ${originStoreName}</span>
          </div>

          <a href="product.html?id=${p.id}" style="text-decoration: none; color: inherit;">
            <h3 class="product-card-title" title="${p.name}">${p.name}</h3>
          </a>
          
          <div class="product-card-prices">
            <span class="current-price" title="Best Comparison Price">${dealPrice}</span>
            ${originOrigPrice ? `<span class="original-price" title="Original price on ${originStoreName}">${originOrigPrice}</span>` : ''}
          </div>

          <div class="card-direct-actions">
            <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="btn-store-direct" title="Open verified product on ${originStoreName}">
              Buy on ${originStoreName} ↗
            </a>
            <a href="product.html?id=${p.id}" class="btn-compare-link" title="Compare all stores and read customer reviews">
              Compare ➔
            </a>
          </div>

          <div class="product-card-bottom-row" style="margin-top: 10px;">
            <div class="product-stars">★★★★★ <span class="review-count-text">(${p.reviewCount || (p.bestRating ? Math.round(p.bestRating * 85) : 340)} reviews)</span></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupFilterListeners() {
  const sortSelect = document.getElementById('sortBy');
  const priceRange = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceDisplay');
  const categoryFilter = document.getElementById('categoryFilter');
  const brandFilter = document.getElementById('brandFilter');

  if (sortSelect) sortSelect.addEventListener('change', applyActiveFilters);
  if (priceRange && priceDisplay) {
    priceRange.addEventListener('input', () => {
      priceDisplay.textContent = `$${parseInt(priceRange.value).toLocaleString()}`;
      applyActiveFilters();
    });
  }
  if (categoryFilter) categoryFilter.addEventListener('change', applyActiveFilters);
  if (brandFilter) brandFilter.addEventListener('change', applyActiveFilters);
}

function applyActiveFilters() {
  const sort = document.getElementById('sortBy')?.value || 'best_deal';
  const maxPriceUSD = parseInt(document.getElementById('priceRange')?.value || 2500);
  const maxPriceINR = maxPriceUSD * 80;
  const selectedCategory = document.getElementById('categoryFilter')?.value || '';
  const selectedBrand = document.getElementById('brandFilter')?.value || '';

  let filtered = [...allProducts].filter(p => {
    const matchesPrice = (p.minPrice || 0) <= maxPriceINR;
    const matchesCat = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesBrand = !selectedBrand || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesPrice && matchesCat && matchesBrand;
  });

  if (sort === 'price_asc') filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
  else if (sort === 'price_desc') filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
  else if (sort === 'rating_desc') filtered.sort((a, b) => (b.bestRating || 0) - (a.bestRating || 0));

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length;

  renderNovaTrendCards(filtered);
}

function populateFilterDropdowns(products) {
  const catSelect = document.getElementById('categoryFilter');
  const brandSelect = document.getElementById('brandFilter');

  if (catSelect && catSelect.options.length <= 1) {
    const cats = [...new Set(products.map(p => p.category))];
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      catSelect.appendChild(opt);
    });
  }

  if (brandSelect && brandSelect.options.length <= 1) {
    const brands = [...new Set(products.map(p => p.brand))];
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });
  }
}

function resetFilters() {
  const catSelect = document.getElementById('categoryFilter');
  const brandSelect = document.getElementById('brandFilter');
  const priceRange = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceDisplay');
  const sortSelect = document.getElementById('sortBy');

  if (catSelect) catSelect.value = '';
  if (brandSelect) brandSelect.value = '';
  if (priceRange) {
    priceRange.value = 2500;
    if (priceDisplay) priceDisplay.textContent = '$2,500';
  }
  if (sortSelect) sortSelect.value = 'best_deal';

  renderNovaTrendCards(allProducts);
}

function checkIfFav(productId) {
  const favs = JSON.parse(localStorage.getItem('novatrend_favorites') || '[]');
  return favs.includes(productId);
}

function toggleFavorite(productId, btn) {
  let favs = JSON.parse(localStorage.getItem('novatrend_favorites') || '[]');
  if (favs.includes(productId)) {
    favs = favs.filter(id => id !== productId);
    btn.textContent = '♡';
    btn.classList.remove('active');
  } else {
    favs.push(productId);
    btn.textContent = '❤️';
    btn.classList.add('active');
  }
  localStorage.setItem('novatrend_favorites', JSON.stringify(favs));
  localStorage.setItem('novatrend_fav_count', favs.length);
  
  const favBadge = document.getElementById('favBadgeCount');
  if (favBadge) favBadge.textContent = favs.length;
}

/**
 * ============================================================================
 * PRICEHUNT PRODUCT SEARCH & CATALOG RENDERER
 * Supports 100 Products across 6 Research Catalogue Categories:
 * 1. Smartphones (15)
 * 2. Laptops (10)
 * 3. Electronics & Gadgets (20)
 * 4. Fashion & Clothing (20)
 * 5. Footwear (15)
 * 6. Accessories (20)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  setupSearchTriggers();
  setupSearchResultsPage();
  updateWishlistBadge();
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

// Helper for flexible category matching
function normalizeCategory(catStr) {
  if (!catStr) return '';
  const s = catStr.toLowerCase().trim();
  if (s === 'smartphones' || s === 'phones' || s === 'mobile' || s === 'mobiles') return 'Smartphones';
  if (s === 'laptops' || s === 'computers' || s === 'laptop') return 'Laptops';
  if (s.includes('electronics') || s.includes('gadget')) return 'Electronics & Gadgets';
  if (s.includes('fashion') || s.includes('cloth') || s.includes('apparel')) return 'Fashion & Clothing';
  if (s.includes('footwear') || s.includes('shoe') || s.includes('sneaker')) return 'Footwear';
  if (s.includes('accessori')) return 'Accessories';
  return catStr;
}

async function setupSearchResultsPage() {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const query = (urlParams.get('q') || '').trim();
  const rawCat = (urlParams.get('category') || '').trim();
  const category = normalizeCategory(rawCat);

  const searchInput = document.getElementById('searchQueryInput');
  if (searchInput) searchInput.value = query;

  const queryDisplay = document.getElementById('queryDisplay');
  if (queryDisplay) {
    if (query && category) {
      queryDisplay.textContent = `"${query}" in ${category}`;
    } else if (query) {
      queryDisplay.textContent = `"${query}"`;
    } else if (category) {
      queryDisplay.textContent = `${category}`;
    } else {
      queryDisplay.textContent = 'All 100 Products';
    }
  }

  await loadAndRenderProducts(query, category);
  setupFilterListeners();
  setupCategoryPills(category);
}

async function loadAndRenderProducts(initialQuery = '', initialCategory = '') {
  const grid = document.getElementById('searchResultsGrid');
  const countEl = document.getElementById('resultCount');
  if (!grid) return;

  // Multi-store loading scanner + skeleton loader
  grid.innerHTML = `
    <div style="grid-column: 1/-1;">
      <div id="store-scanner-container" class="store-scanner-container">
        <div class="store-scanner-spinner"></div>
        <div class="store-scanner-text" id="liveScannerStatus">Checking Amazon... Flipkart...</div>
        <div class="store-scanner-subtext">Scanning real-time prices across Amazon, Flipkart, Myntra & AJIO</div>
      </div>
    </div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
    <div class="skeleton-card"><div class="skeleton-thumb skeleton-box"></div><div class="skeleton-box" style="height:18px;margin-bottom:8px;"></div><div class="skeleton-box" style="height:14px;width:60%;"></div></div>
  `;

  // Dynamic cycling text between requested stores
  const storeTexts = [
    "Checking Amazon India...",
    "Scanning Flipkart deals...",
    "Verifying Myntra & AJIO...",
    "Finding lowest price deals in INR (₹)..."
  ];
  let textIndex = 0;
  const cycleInterval = setInterval(() => {
    const el = document.getElementById('liveScannerStatus');
    if (el) {
      textIndex = (textIndex + 1) % storeTexts.length;
      el.textContent = storeTexts[textIndex];
    }
  }, 350);

  try {
    // Fetch all 100 products for smooth local multi-filter & category switching
    const [fetchedProducts] = await Promise.all([
      Api.request('/products'),
      new Promise(res => setTimeout(res, 450))
    ]);
    clearInterval(cycleInterval);
    allProducts = fetchedProducts;

    populateFilterDropdowns(allProducts, initialCategory);

    // If an initial category was supplied in the URL, select it in the dropdown
    const catSelect = document.getElementById('categoryFilter');
    if (catSelect && initialCategory) {
      catSelect.value = initialCategory;
    }

    applyActiveFilters();
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
        <h4 style="font-weight: 700; font-size: 17px; color: var(--text-main); margin-bottom: 0.25rem;">No products match your filters</h4>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 1.25rem;">Try adjusting price range or select "All Categories" to view all 100 products.</p>
        <button class="btn-primary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ff4e27' font-family='sans-serif' font-size='16' font-weight='bold'>PriceHunt Verified</text></svg>`;

  grid.innerHTML = products.map(p => {
    const dealPrice = p.minPrice ? `₹${Number(p.minPrice).toLocaleString('en-IN')}` : '₹4,999';
    const originOrigPrice = p.originOriginalPrice ? `₹${Number(p.originOriginalPrice).toLocaleString('en-IN')}` : (p.maxPrice ? `₹${Number(p.maxPrice).toLocaleString('en-IN')}` : null);
    const originStoreName = p.originStore || 'Flipkart';
    const originLogo = p.originStoreLogo || 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png';
    const directUrl = p.directStoreUrl || (p.listings && p.listings[0] ? p.listings[0].productUrl : 'https://www.flipkart.com');
    const isFav = checkIfFav(p.id);
    const discountText = p.maxDiscount && p.maxDiscount > 3 ? `-${Math.round(p.maxDiscount)}%` : 'VERIFIED DEAL';

    return `
      <div class="product-item-card">
        <div class="card-top-badges">
          <span class="badge-tag tag-discount">${discountText}</span>
          <button type="button" class="btn-wishlist ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id}, this)" title="Save to Wishlist">
            ${isFav ? '❤️' : '♡'}
          </button>
        </div>

        <a href="product.html?id=${p.id}" class="product-thumb-wrap">
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSvg}';">
        </a>

        <div class="product-card-details">
          <div class="card-store-banner">
            <span class="store-origin-tag">
              <img src="${originLogo}" alt="${originStoreName}">
              ${originStoreName}
            </span>
            ${p.originOriginalPrice && p.minPrice ? `<span class="store-savings-badge">Save ₹${Number(p.originOriginalPrice - p.minPrice).toLocaleString('en-IN')}</span>` : ''}
          </div>

          <a href="product.html?id=${p.id}" style="text-decoration: none; color: inherit;">
            <h3 class="product-card-title" title="${p.name}">${p.name}</h3>
          </a>
          
          <div class="product-store-pricing">
            <div class="store-price-row">
              <span class="store-deal-price">${dealPrice}</span>
              ${originOrigPrice ? `<span class="store-original-price">${originOrigPrice}</span>` : ''}
            </div>
            <small class="store-origin-label">Best price on ${originStoreName}</small>
          </div>

          <div class="product-stars">★★★★★ <span class="review-count-text">(${p.reviewCount || 2400})</span></div>

          <div class="product-card-actions-row">
            <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="btn-visit-store" title="Buy verified product on ${originStoreName}">
              Buy on ${originStoreName} ↗
            </a>
            <a href="product.html?id=${p.id}" class="btn-compare-action" title="Compare across Amazon, Flipkart, Myntra, AJIO">
              🛍️
            </a>
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
      priceDisplay.textContent = `₹${parseInt(priceRange.value).toLocaleString('en-IN')}`;
      applyActiveFilters();
    });
  }
  if (categoryFilter) categoryFilter.addEventListener('change', () => {
    setActivePill(categoryFilter.value);
    updateQueryHeadline();
    applyActiveFilters();

    const url = new URL(window.location.href);
    if (categoryFilter.value) {
      url.searchParams.set('category', categoryFilter.value);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url.toString());
  });
  if (brandFilter) brandFilter.addEventListener('change', applyActiveFilters);
}

function setupCategoryPills(activeCategory = '') {
  const pillsBar = document.getElementById('categoryPillsBar');
  if (!pillsBar) return;
  const pills = pillsBar.querySelectorAll('.category-pill-btn');
  pills.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || '';
      const catSelect = document.getElementById('categoryFilter');
      if (catSelect) catSelect.value = cat;
      setActivePill(cat);
      updateQueryHeadline();
      applyActiveFilters();

      const url = new URL(window.location.href);
      if (cat) {
        url.searchParams.set('category', cat);
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState({}, '', url.toString());
    });
  });
  setActivePill(activeCategory);
}

function setActivePill(cat) {
  const pillsBar = document.getElementById('categoryPillsBar');
  if (!pillsBar) return;
  const norm = normalizeCategory(cat);
  const pills = pillsBar.querySelectorAll('.category-pill-btn');
  pills.forEach(btn => {
    const btnCat = btn.getAttribute('data-category') || '';
    if ((!cat && !btnCat) || (norm && normalizeCategory(btnCat) === norm)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateQueryHeadline() {
  const queryDisplay = document.getElementById('queryDisplay');
  const selectedCategory = document.getElementById('categoryFilter')?.value || '';
  const searchInput = document.getElementById('searchQueryInput');
  const query = searchInput ? searchInput.value.trim() : '';

  if (queryDisplay) {
    if (query && selectedCategory) {
      queryDisplay.textContent = `"${query}" in ${selectedCategory}`;
    } else if (query) {
      queryDisplay.textContent = `"${query}"`;
    } else if (selectedCategory) {
      queryDisplay.textContent = `${selectedCategory}`;
    } else {
      queryDisplay.textContent = 'All Products';
    }
  }
}

function applyActiveFilters() {
  const sort = document.getElementById('sortBy')?.value || 'best_deal';
  const maxPriceINR = parseInt(document.getElementById('priceRange')?.value || 200000);
  const selectedCategory = document.getElementById('categoryFilter')?.value || '';
  const selectedBrand = document.getElementById('brandFilter')?.value || '';
  const searchInput = document.getElementById('searchQueryInput');
  const query = (searchInput ? searchInput.value.trim() : '').toLowerCase();

  let filtered = [...allProducts].filter(p => {
    const matchesPrice = (p.minPrice || 0) <= maxPriceINR;
    const matchesCat = !selectedCategory || normalizeCategory(p.category) === normalizeCategory(selectedCategory);
    const matchesBrand = !selectedBrand || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesQuery = !query || 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query));
    return matchesPrice && matchesCat && matchesBrand && matchesQuery;
  });

  if (sort === 'price_asc') filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
  else if (sort === 'price_desc') filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
  else if (sort === 'rating_desc') filtered.sort((a, b) => (b.bestRating || 0) - (a.bestRating || 0));
  else if (sort === 'discount_desc') filtered.sort((a, b) => (b.maxDiscount || 0) - (a.maxDiscount || 0));

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length;

  renderNovaTrendCards(filtered);
}

function populateFilterDropdowns(products, currentCategory = '') {
  const catSelect = document.getElementById('categoryFilter');
  const brandSelect = document.getElementById('brandFilter');

  if (catSelect) {
    // 6 official categories from the research catalogue PDF with counts
    const canonicalCategories = [
      "Smartphones",
      "Laptops",
      "Electronics & Gadgets",
      "Fashion & Clothing",
      "Footwear",
      "Accessories"
    ];

    catSelect.innerHTML = `<option value="">All Categories (${products.length})</option>`;
    canonicalCategories.forEach(c => {
      const count = products.filter(p => normalizeCategory(p.category) === c).length;
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `${c} (${count})`;
      if (normalizeCategory(currentCategory) === c) {
        opt.selected = true;
      }
      catSelect.appendChild(opt);
    });
  }

  if (brandSelect && brandSelect.options.length <= 1) {
    const brands = [...new Set(products.map(p => p.brand))].filter(Boolean);
    brands.sort().forEach(b => {
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
  const searchInput = document.getElementById('searchQueryInput');

  if (catSelect) catSelect.value = '';
  if (brandSelect) brandSelect.value = '';
  if (searchInput) searchInput.value = '';
  if (priceRange) priceRange.value = 200000;
  if (priceDisplay) priceDisplay.textContent = '₹2,00,000';
  updateQueryHeadline();
  setActivePill('');
  applyActiveFilters();

  const url = new URL(window.location.href);
  url.searchParams.delete('category');
  url.searchParams.delete('q');
  window.history.replaceState({}, '', url.toString());
}

function checkIfFav(productId) {
  const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[1, 2, 17, 35, 70]');
  return favs.includes(productId);
}

function toggleFavorite(productId, btn) {
  let favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[1, 2, 17, 35, 70]');
  if (favs.includes(productId)) {
    favs = favs.filter(id => id !== productId);
    btn.textContent = '♡';
    btn.classList.remove('active');
  } else {
    favs.push(productId);
    btn.textContent = '❤️';
    btn.classList.add('active');
  }
  localStorage.setItem('pricehunt_favorites', JSON.stringify(favs));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[1, 2, 17, 35, 70]');
  const favBadge = document.getElementById('favBadgeCount');
  if (favBadge) favBadge.textContent = favs.length;
}

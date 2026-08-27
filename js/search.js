/**
 * ============================================================================
 * PRICEHUNT SEARCH & SHOP CARD RENDER ENGINE
 * Renders 28px pillow-soft elevated cards with dual-layer soft shadows
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
  if (queryDisplay) queryDisplay.textContent = query ? `"${query}"` : 'All Products';

  await loadAndRenderProducts(query, category);
  setupFilterListeners();
}

async function loadAndRenderProducts(query = '', category = '') {
  const grid = document.getElementById('searchResultsGrid');
  const countEl = document.getElementById('resultCount');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
      <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">✦</div>
      <p style="color: var(--muted-gray); font-size: 14px;">Discovering lowest prices across platforms...</p>
    </div>
  `;

  try {
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
    allProducts = await Api.request(endpoint);

    if (countEl) countEl.textContent = allProducts.length;
    renderShopCards(allProducts);
    populateFilterDropdowns(allProducts);
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--shop-violet);">
        <p>Could not load products at this moment.</p>
      </div>
    `;
  }
}

function renderShopCards(products) {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: white; border-radius: var(--radius-card); box-shadow: var(--shadow-elevated-card);">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛍️</div>
        <h4 style="font-weight: 500; font-size: 18px; margin-bottom: 0.5rem;">No items found</h4>
        <p style="color: var(--muted-gray); font-size: 14px; margin-bottom: 1.5rem;">Try searching for iPhone 15, MacBook, or Sony XM5</p>
        <button class="pill-btn pill-btn-violet" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const priceFormatted = p.minPrice ? `₹${p.minPrice.toLocaleString('en-IN')}` : 'Check';
    const isFav = checkIfFav(p.id);

    return `
      <div class="shop-card">
        <div class="shop-card-image-wrap">
          ${p.bestDealListing ? `<div class="shop-card-badge">⚡ Best Deal</div>` : ''}
          <button class="shop-card-fav" onclick="toggleFavorite(${p.id}, this)" title="Save">
            ${isFav ? '❤️' : '🤍'}
          </button>
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=Product'">
        </div>

        <div class="shop-card-body">
          <div class="shop-card-brand">${p.brand} • ${p.category}</div>
          <h3 class="shop-card-title" title="${p.name}">${p.name}</h3>

          <div class="shop-card-rating">
            <span style="color: var(--shop-violet);">★</span>
            <span>${p.bestRating || '4.6'}</span>
            <span>(${p.listingCount || 3} stores)</span>
          </div>

          <div class="shop-card-footer">
            <div class="shop-card-price">${priceFormatted}</div>
            <a href="product.html?id=${p.id}" class="shop-card-action">
              Compare ➔
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
  if (categoryFilter) categoryFilter.addEventListener('change', applyActiveFilters);
  if (brandFilter) brandFilter.addEventListener('change', applyActiveFilters);
}

function applyActiveFilters() {
  const sort = document.getElementById('sortBy')?.value || 'best_deal';
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 250000);
  const selectedCategory = document.getElementById('categoryFilter')?.value || '';
  const selectedBrand = document.getElementById('brandFilter')?.value || '';

  let filtered = [...allProducts].filter(p => {
    const matchesPrice = (p.minPrice || 0) <= maxPrice;
    const matchesCat = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesBrand = !selectedBrand || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesPrice && matchesCat && matchesBrand;
  });

  if (sort === 'price_asc') filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
  else if (sort === 'price_desc') filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
  else if (sort === 'rating_desc') filtered.sort((a, b) => (b.bestRating || 0) - (a.bestRating || 0));
  else if (sort === 'discount_desc') filtered.sort((a, b) => (b.maxDiscount || 0) - (a.maxDiscount || 0));

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length;

  renderShopCards(filtered);
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
    priceRange.value = 250000;
    if (priceDisplay) priceDisplay.textContent = '₹2,50,000';
  }
  if (sortSelect) sortSelect.value = 'best_deal';

  renderShopCards(allProducts);
}

function checkIfFav(productId) {
  const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[]');
  return favs.includes(productId);
}

function toggleFavorite(productId, btn) {
  let favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[]');
  if (favs.includes(productId)) {
    favs = favs.filter(id => id !== productId);
    btn.textContent = '🤍';
  } else {
    favs.push(productId);
    btn.textContent = '❤️';
  }
  localStorage.setItem('pricehunt_favorites', JSON.stringify(favs));
}

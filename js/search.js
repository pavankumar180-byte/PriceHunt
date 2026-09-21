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

  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
      <p style="font-size: 15px;">Loading latest arrivals and trending products...</p>
    </div>
  `;

  try {
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
    allProducts = await Api.request(endpoint);

    if (countEl) countEl.textContent = allProducts.length;
    renderNovaTrendCards(allProducts);
    populateFilterDropdowns(allProducts);
  } catch (err) {
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
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 1.25rem;">Try searching for hoodies, sneakers, headphones, or watches</p>
        <button class="btn-primary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const priceFormatted = p.minPrice ? `$${(p.minPrice / 80).toFixed(2)}` : '$59.99';
    const origPriceFormatted = p.maxPrice ? `$${(p.maxPrice / 80).toFixed(2)}` : null;
    const isFav = checkIfFav(p.id);
    const discountText = p.maxDiscount && p.maxDiscount > 10 ? `-${Math.round(p.maxDiscount)}%` : 'New';
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
          <h3 class="product-card-title" title="${p.name}">${p.name}</h3>
          
          <div class="product-card-prices">
            <span class="current-price">${priceFormatted}</span>
            ${origPriceFormatted ? `<span class="original-price">${origPriceFormatted}</span>` : ''}
          </div>

          <div class="product-card-bottom-row">
            <div class="product-stars">★★★★★ <span class="review-count-text">(${p.bestRating ? Math.round(p.bestRating * 30) : 110})</span></div>
            <a href="product.html?id=${p.id}" class="btn-add-cart-circle" title="View & Compare Store Deals">
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

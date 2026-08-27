/**
 * ============================================================================
 * PRICEHUNT SEARCH & FILTER ENGINE
 * Handles query parsing, faceted filtering, dynamic sorting, and card rendering
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  setupSearchTriggers();
  setupSearchResultsPage();
});

// Setup search bars across Landing, Header, and Dashboard
function setupSearchTriggers() {
  const forms = document.querySelectorAll('.search-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.search-input');
      const query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  });
}

// Setup Search Results Page
let allProducts = [];

async function setupSearchResultsPage() {
  const resultsContainer = document.getElementById('searchResultsGrid');
  if (!resultsContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const initialCategory = urlParams.get('category') || '';

  const searchInput = document.getElementById('searchQueryInput');
  if (searchInput) {
    searchInput.value = initialQuery;
  }

  const queryDisplay = document.getElementById('queryDisplay');
  if (queryDisplay) {
    queryDisplay.textContent = initialQuery ? `"${initialQuery}"` : 'All Products';
  }

  await loadAndRenderProducts(initialQuery, initialCategory);
  setupFilterListeners();
}

async function loadAndRenderProducts(query = '', category = '') {
  const grid = document.getElementById('searchResultsGrid');
  const countEl = document.getElementById('resultCount');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
      <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
      <p style="color: var(--text-muted); font-size: 1.1rem;">Hunting for the best deals across platforms...</p>
    </div>
  `;

  try {
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
    allProducts = await Api.request(endpoint);

    if (countEl) countEl.textContent = allProducts.length;

    renderProductCards(allProducts);
    populateFilterDropdowns(allProducts);
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--danger);">
        <p>Could not load products. Please check if the service is running.</p>
      </div>
    `;
  }
}

function renderProductCards(products) {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
        <h3 style="margin-bottom: 0.5rem;">No products found</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try refining your search keyword or clearing filters.</p>
        <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const minPriceFormatted = p.minPrice ? `₹${p.minPrice.toLocaleString('en-IN')}` : 'Check Prices';
    const originalPriceFormatted = p.listings && p.listings[0] ? `₹${p.listings[0].originalPrice.toLocaleString('en-IN')}` : '';
    const discount = p.maxDiscount ? `${Math.round(p.maxDiscount)}% OFF` : '';
    const isFav = checkIfFav(p.id);

    return `
      <div class="product-card">
        <div class="product-img-wrapper">
          <div class="product-badge-group">
            ${p.bestDealListing ? `<span class="badge badge-deal">⚡ Best Deal</span>` : ''}
            ${discount ? `<span class="badge badge-discount">${discount}</span>` : ''}
          </div>
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id}, this)" title="Save to Wishlist">
            ${isFav ? '❤️' : '🤍'}
          </button>
          <img src="${p.imageUrl}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=Product+Image'">
        </div>

        <div class="product-content">
          <div class="product-category">${p.category} • ${p.brand}</div>
          <h3 class="product-name" title="${p.name}">${p.name}</h3>
          
          <div class="product-rating">
            <span class="stars">★</span>
            <strong>${p.bestRating || '4.5'}</strong>
            <span>(${p.listingCount || 3} stores compared)</span>
          </div>

          <div class="product-pricing">
            <div class="price-row">
              <span class="current-price">${minPriceFormatted}</span>
              ${originalPriceFormatted ? `<span class="original-price">${originalPriceFormatted}</span>` : ''}
            </div>
            <div class="platform-count">Available on Amazon, Flipkart, Croma</div>
            <a href="product.html?id=${p.id}" class="btn btn-primary" style="width: 100%;">
              Compare Prices ➔
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

  if (sortSelect) {
    sortSelect.addEventListener('change', applyActiveFilters);
  }

  if (priceRange && priceDisplay) {
    priceRange.addEventListener('input', () => {
      priceDisplay.textContent = `₹${parseInt(priceRange.value).toLocaleString('en-IN')}`;
      applyActiveFilters();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyActiveFilters);
  }

  if (brandFilter) {
    brandFilter.addEventListener('change', applyActiveFilters);
  }
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

  // Apply sorting
  if (sort === 'price_asc') {
    filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
  } else if (sort === 'rating_desc') {
    filtered.sort((a, b) => (b.bestRating || 0) - (a.bestRating || 0));
  } else if (sort === 'discount_desc') {
    filtered.sort((a, b) => (b.maxDiscount || 0) - (a.maxDiscount || 0));
  }

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length;

  renderProductCards(filtered);
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

  renderProductCards(allProducts);
}

function checkIfFav(productId) {
  const favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[]');
  return favs.includes(productId);
}

function toggleFavorite(productId, btn) {
  let favs = JSON.parse(localStorage.getItem('pricehunt_favorites') || '[]');
  if (favs.includes(productId)) {
    favs = favs.filter(id => id !== productId);
    btn.classList.remove('active');
    btn.textContent = '🤍';
  } else {
    favs.push(productId);
    btn.classList.add('active');
    btn.textContent = '❤️';
  }
  localStorage.setItem('pricehunt_favorites', JSON.stringify(favs));
}

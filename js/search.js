/**
 * ============================================================================
 * PRICEHUNT 5D HYPER-DIMENSIONAL CARD & ALGORITHM ENGINE
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
      <div style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--accent-cyan);">✦</div>
      <p style="color: var(--text-muted); font-size: 14px;">Evaluating 5-Factor Deal Scores & Jaro-Winkler Matching...</p>
    </div>
  `;

  try {
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
    allProducts = await Api.request(endpoint);

    if (countEl) countEl.textContent = allProducts.length;
    render5DCards(allProducts);
    populateFilterDropdowns(allProducts);
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--accent-rose);">
        <p>Could not load product catalog.</p>
      </div>
    `;
  }
}

function render5DCards(products) {
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-card); border: 1px solid var(--border-dark);">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛍️</div>
        <h4 style="font-weight: 700; font-size: 18px; color: var(--text-pure); margin-bottom: 0.5rem;">No items found</h4>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 1.5rem;">Try searching for shoes, watches, laptops, or smartphones</p>
        <button class="btn-hunt-5d" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const priceFormatted = p.minPrice ? `₹${p.minPrice.toLocaleString('en-IN')}` : 'Check Prices';
    const isFav = checkIfFav(p.id);
    
    // Algorithmic Buy Signal Generator
    const isBuyNow = (p.maxDiscount && p.maxDiscount > 15) || (p.minPrice < 30000);
    const signalBadge = isBuyNow ? 
      `<span class="badge-buy-now">🟢 BUY NOW</span>` : 
      `<span class="badge-wait">🟡 FAIR PRICE</span>`;

    return `
      <div class="hot-product-card-5d">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 0;">
          ${signalBadge}
          <span style="font-size: 15px; font-weight: 800; color: var(--text-pure);">${priceFormatted}</span>
        </div>

        <div style="height: 185px; display: flex; align-items: center; justify-content: center; padding: 1rem; position: relative;">
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" style="max-height: 100%; object-fit: contain; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.5));" onerror="this.src='https://placehold.co/400x300?text=Product'">
          <a href="product.html?id=${p.id}" class="btn-hunt-5d" style="position: absolute; bottom: 8px; padding: 4px 14px; font-size: 11px; box-shadow: var(--shadow-5d-card);">
            • Compare ${priceFormatted}
          </a>
        </div>

        <div style="padding: 14px 16px 16px; border-top: 1px solid var(--border-dark);">
          <div style="font-size: 14px; font-weight: 700; color: var(--text-pure); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;" title="${p.name}">${p.name}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; color: #f59e0b;">★★★★★ <span style="color: var(--text-muted); font-size: 11px;">(${p.bestRating || '4.7'})</span></div>
            <button onclick="toggleFavorite(${p.id}, this)" style="background: none; border: none; cursor: pointer; font-size: 14px; color: ${isFav ? '#ef4444' : 'var(--text-muted)'};">
              ${isFav ? '❤️' : '🤍'}
            </button>
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

  render5DCards(filtered);
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

  render5DCards(allProducts);
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
    btn.style.color = 'var(--text-muted)';
  } else {
    favs.push(productId);
    btn.textContent = '❤️';
    btn.style.color = '#ef4444';
  }
  localStorage.setItem('pricehunt_favorites', JSON.stringify(favs));
}

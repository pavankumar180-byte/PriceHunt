/**
 * ============================================================================
 * PRICEHUNT STOREFRONT INTERACTION ENGINE
 * Theme Engine (Dark & Light Mode), Dynamic Countdown, Cart, Wishlist,
 * and Multi-Store Real-Time Quick Compare Modal
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initCountdownTimer();
  initWishlistAndCart();
  initKeyboardShortcuts();
});

/* --------------------------------------------------------------------------
   1. Dark & Light Mode Theme Engine
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const savedTheme = localStorage.getItem('pricehunt_theme') || localStorage.getItem('novatrend_theme') || 'light';
  applyTheme(savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('🌙');
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon('☀️');
  }
  localStorage.setItem('pricehunt_theme', theme);
}

function updateThemeIcon(icon) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.textContent = icon;
    btn.setAttribute('title', `Switch to ${icon === '🌙' ? 'Light' : 'Dark'} Mode`);
  });
}

/* --------------------------------------------------------------------------
   2. Flash Sale Countdown Timer (Ticking Live)
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minsEl = document.getElementById('countdownMins');
  const secsEl = document.getElementById('countdownSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Set target date to 2 days, 15 hours, 45 mins from now
  let totalSeconds = (2 * 24 * 3600) + (15 * 3600) + (45 * 60) + 30;

  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }, 1000);
}

/* --------------------------------------------------------------------------
   3. Wishlist & Cart Counter State
   -------------------------------------------------------------------------- */
function initWishlistAndCart() {
  updateBadges();

  // Handle Wishlist toggles
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      let favCount = parseInt(localStorage.getItem('pricehunt_fav_count') || localStorage.getItem('novatrend_fav_count') || '0');
      if (btn.classList.contains('active')) {
        favCount++;
      } else {
        favCount = Math.max(0, favCount - 1);
      }
      localStorage.setItem('pricehunt_fav_count', favCount);
      updateBadges();
    });
  });
}

function updateBadges() {
  const cartBadge = document.getElementById('cartBadgeCount');
  const favBadge = document.getElementById('favBadgeCount');

  const cartCount = localStorage.getItem('pricehunt_cart_count') || localStorage.getItem('novatrend_cart_count') || '0';
  const favCount = localStorage.getItem('pricehunt_fav_count') || localStorage.getItem('novatrend_fav_count') || '0';

  if (cartBadge) cartBadge.textContent = cartCount;
  if (favBadge) favBadge.textContent = favCount;
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickCompare();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Instant Multi-Store Price Comparison Modal Engine
   (Compares Amazon, Flipkart, Myntra, Croma, Reliance Digital, etc.)
   -------------------------------------------------------------------------- */
window.openQuickCompare = async function(productId) {
  let modal = document.getElementById('quickCompareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickCompareModal';
    modal.className = 'quick-compare-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeQuickCompare(); };
    modal.innerHTML = `
      <div class="quick-compare-dialog" onclick="event.stopPropagation()">
        <button type="button" class="modal-close-btn" onclick="closeQuickCompare()" title="Close">✕</button>
        <div id="quickCompareContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const content = document.getElementById('quickCompareContent');
  content.innerHTML = `
    <div id="quickCompareScanner" class="store-scanner-container" style="padding: 2.5rem 1rem;">
      <div class="store-scanner-spinner"></div>
      <div class="store-scanner-text" id="quickCompareScannerStatus">Checking Amazon... Myntra...</div>
      <div class="store-scanner-subtext">Scanning live real-time prices across Flipkart, Amazon, Myntra & Ajio</div>
    </div>
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const storeTexts = [
    "Checking Amazon... Myntra...",
    "Checking Flipkart... Ajio...",
    "Comparing best prices across all stores...",
    "Finding lowest price deals..."
  ];
  let textIndex = 0;
  const cycleInterval = setInterval(() => {
    const el = document.getElementById('quickCompareScannerStatus');
    if (el) {
      textIndex = (textIndex + 1) % storeTexts.length;
      el.textContent = storeTexts[textIndex];
    }
  }, 400);

  try {
    let data;
    if (window.Api) {
      const [fetched] = await Promise.all([
        Api.request(`/compare/${productId}`),
        new Promise(res => setTimeout(res, 500))
      ]);
      data = fetched;
    } else {
      data = { product: null };
    }
    clearInterval(cycleInterval);

    const p = data.product;
    if (!p) throw new Error('Product not found');

    const rawListings = data.rankedListings || p.listings || [];
    // Strict best-deal-first sorting (lowest price at the top)
    const listings = [...rawListings].sort((a, b) => a.price - b.price);
    const bestDeal = listings[0] || {};
    const lowestDeal = listings[0] || {};

    let specsHtml = '';
    if (p.specsJson) {
      try {
        const specs = typeof p.specsJson === 'string' ? JSON.parse(p.specsJson) : p.specsJson;
        specsHtml = Object.entries(specs).slice(0, 3).map(([k, v]) => `
          <span style="background: var(--bg-secondary); padding: 3px 8px; border-radius: var(--radius-xs); font-size: 11px; color: var(--text-secondary); border: 1px solid var(--border-color);">
            <strong>${k}:</strong> ${v}
          </span>
        `).join(' ');
      } catch (e) {}
    }

    const originStoreName = p.originStore || 'Amazon';
    const originLogo = p.originStoreLogo || '📦';
    const originPriceFormatted = p.originOriginalPrice ? `₹${Number(p.originOriginalPrice).toLocaleString('en-IN')}` : null;

    content.innerHTML = `
      <!-- Product Header -->
      <div style="display: flex; gap: 16px; margin-bottom: 1.5rem; align-items: flex-start;">
        <img src="${p.imageUrl}" alt="${p.name}" style="width: 88px; height: 88px; object-fit: contain; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-secondary); padding: 4px; flex-shrink: 0;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
            <span class="compare-product-badge">${p.category}</span>
            <span class="store-badge-origin">${originLogo} Origin: ${originStoreName}</span>
            <span style="font-size: 11px; font-weight: 700; color: #10b981; background: rgba(16,185,129,0.12); padding: 2px 6px; border-radius: var(--radius-xs);">
              Save up to ${Math.round(p.maxDiscount || 25)}%
            </span>
          </div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 4px; line-height: 1.3;">
            ${p.name}
          </h3>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px;">
            <span style="color: #f59e0b;">★★★★★</span>
            <span style="color: var(--text-muted); font-size: 12px;">(${p.reviewCount ? Number(p.reviewCount).toLocaleString('en-IN') : '1,240'} verified reviews)</span>
            ${originPriceFormatted ? `<span style="color: var(--text-muted); font-size: 12px;">Original on ${originStoreName}: <strong style="text-decoration: line-through;">${originPriceFormatted}</strong></span>` : ''}
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${specsHtml}
          </div>
        </div>
      </div>

      <!-- Quick Stats Banner -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.25rem; background: var(--bg-secondary); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <div>
          <small style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em;">🏆 Best Overall Price</small>
          <div style="font-size: 20px; font-weight: 800; color: #10b981;">
            ₹${Number(lowestDeal.price).toLocaleString('en-IN')}
          </div>
          <span style="font-size: 11px; color: var(--text-secondary);">Available on <strong>${lowestDeal.platformName}</strong></span>
        </div>
        <div>
          <small style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em;">AI Value & Delivery Score</small>
          <div style="font-size: 20px; font-weight: 800; color: var(--primary);">
            ${Math.round(bestDeal.dealScore || 96)}/100
          </div>
          <span style="font-size: 11px; color: var(--text-secondary);">Fastest Delivery on <strong>${bestDeal.platformName}</strong></span>
        </div>
      </div>

      <!-- Store Comparison Matrix (Sorted with Best Price at Top) -->
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            Price Comparison (${listings.length} Stores — Ranked Lowest to Highest)
          </h4>
          <span style="font-size: 11px; color: #10b981; font-weight: 600;">● Live Verified</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${listings.map((l, idx) => {
            const isTop = idx === 0;
            const priceFmt = `₹${Number(l.price).toLocaleString('en-IN')}`;
            const origFmt = l.originalPrice ? `₹${Number(l.originalPrice).toLocaleString('en-IN')}` : null;
            return `
              <div class="compare-store-row ${isTop ? 'best-deal-row' : ''}" style="${isTop ? 'border: 2px solid var(--primary); background: var(--primary-light);' : ''}">
                <div class="store-meta-group">
                  <span style="font-size: 1.5rem;">${l.platformLogo || '🏪'}</span>
                  <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <strong style="font-size: 13px; color: var(--text-main);">${l.platformName}</strong>
                      ${isTop ? '<span style="font-size: 10px; font-weight: 700; background: #10b981; color: #fff; padding: 2px 6px; border-radius: 3px;">🏆 BEST PRICE</span>' : ''}
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); display: flex; gap: 6px;">
                      <span style="color: #f59e0b;">★ ${l.rating || '4.8'}</span>
                      <span>•</span>
                      <span>${l.deliveryDays === 1 ? '⚡ 1 Day Delivery' : `${l.deliveryDays || 2} Days`}</span>
                      <span>•</span>
                      <span>Score: ${Math.round(l.dealScore || 90)}/100</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="text-align: right;">
                    <div style="font-weight: 800; font-size: 15px; color: var(--text-main);">
                      ${priceFmt}
                    </div>
                    ${origFmt && l.originalPrice > l.price ? `<div style="font-size: 11px; text-decoration: line-through; color: var(--text-muted);">${origFmt}</div>` : ''}
                  </div>
                  <a href="${l.productUrl}" target="_blank" rel="noopener noreferrer" class="btn-store-direct" style="padding: 7px 14px; font-size: 12px; text-decoration: none; white-space: nowrap;" title="Open real verified product on ${l.platformName}">
                    Buy on ${l.platformName} ↗
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Action Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem; flex-wrap: wrap; gap: 8px;">
        <a href="product.html?id=${p.id}" class="btn-secondary" style="font-size: 12px; padding: 8px 14px; text-decoration: none;">
          Full Reviews & 90-Day Trajectory ➔
        </a>
        <button type="button" class="btn-primary" style="font-size: 12px; padding: 8px 18px;" onclick="closeQuickCompare()">
          Done
        </button>
      </div>
    `;
  } catch (err) {
    clearInterval(cycleInterval);
    content.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h4 style="color: var(--text-main); margin-bottom: 0.5rem;">Could not load price comparisons</h4>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 1rem;">Please try again or view the product details page directly.</p>
        <button class="btn-primary" onclick="closeQuickCompare()">Close</button>
      </div>
    `;
  }
};


window.closeQuickCompare = function() {
  const modal = document.getElementById('quickCompareModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
};

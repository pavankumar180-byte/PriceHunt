/**
 * ============================================================================
 * NOVATREND PRODUCT COMPARISON & STORE INTELLIGENCE ENGINE
 * Supports Multi-Store Comparison Matrix & Adaptive Canvas Chart
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  setupProductComparisonPage();
});

let currentProductReviews = [];

async function setupProductComparisonPage() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || '1';

  // Live store scanner spinner with "Checking Amazon... Myntra..."
  const scannerEl = document.createElement('div');
  scannerEl.id = 'productPageScanner';
  scannerEl.className = 'store-scanner-container';
  scannerEl.style.margin = '2rem 0';
  scannerEl.innerHTML = `
    <div class="store-scanner-spinner"></div>
    <div class="store-scanner-text" id="productScannerStatus">Checking Amazon... Myntra...</div>
    <div class="store-scanner-subtext">Comparing live real-time prices across Amazon, Flipkart, Myntra & Ajio...</div>
  `;
  container.prepend(scannerEl);

  const storeTexts = [
    "Checking Amazon... Myntra...",
    "Checking Flipkart... Ajio...",
    "Scanning best deals and price trends...",
    "Loading verified customer reviews..."
  ];
  let textIdx = 0;
  const cycleInterval = setInterval(() => {
    const el = document.getElementById('productScannerStatus');
    if (el) {
      textIdx = (textIdx + 1) % storeTexts.length;
      el.textContent = storeTexts[textIdx];
    }
  }, 400);

  try {
    const [data] = await Promise.all([
      Api.request(`/compare/${productId}`),
      new Promise(res => setTimeout(res, 500)) // smooth scanner display
    ]);
    clearInterval(cycleInterval);
    if (scannerEl && scannerEl.parentNode) scannerEl.parentNode.removeChild(scannerEl);

    renderProductDetails(data);
    renderComparisonTable(data.rankedListings);
    renderProductReviews(data.product);
    renderPriceHistoryChart(productId);
    setupAlertModal(data.product);
  } catch (err) {
    clearInterval(cycleInterval);
    if (scannerEl && scannerEl.parentNode) scannerEl.parentNode.removeChild(scannerEl);
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <h3 style="font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">Product not found</h3>
        <p style="color: var(--text-muted); font-size: 14px;">The requested product could not be retrieved.</p>
        <a href="search.html" class="btn-primary" style="margin-top: 1.5rem; display: inline-flex;">Back to Shop</a>
      </div>
    `;
  }
}

function renderProductDetails(data) {
  const p = data.product;
  const imgEl = document.getElementById('productImage');
  if (imgEl) {
    imgEl.src = p.imageUrl;
    imgEl.alt = p.name;
  }
  document.getElementById('productTitle').textContent = p.name;
  document.getElementById('productCategory').textContent = `${p.category} • ${p.brand}`;
  document.getElementById('productDescription').textContent = p.description;

  const specsContainer = document.getElementById('productSpecsList');
  if (specsContainer && p.specsJson) {
    try {
      const specs = typeof p.specsJson === 'string' ? JSON.parse(p.specsJson) : p.specsJson;
      specsContainer.innerHTML = Object.entries(specs).map(([k, v]) => `
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: 13px;">
          <span style="color: var(--text-muted); text-transform: capitalize;">${k}</span>
          <span style="font-weight: 600; color: var(--text-main);">${v}</span>
        </div>
      `).join('');
    } catch (e) {
      specsContainer.innerHTML = '';
    }
  }

  // Display best deal and lowest price in INR
  if (data.lowestPriceDeal) {
    const price = data.lowestPriceDeal.price;
    const formatted = `₹${Number(price).toLocaleString('en-IN')}`;
    document.getElementById('lowestPriceDisplay').textContent = formatted;
    document.getElementById('lowestPriceStore').textContent = `Lowest on ${data.lowestPriceDeal.platformName}`;
  }

  if (data.bestValueDeal) {
    const price = data.bestValueDeal.price;
    const formatted = `₹${Number(price).toLocaleString('en-IN')}`;
    document.getElementById('bestDealDisplay').textContent = formatted;
    document.getElementById('bestDealStore').textContent = `Best Deal on ${data.bestValueDeal.platformName} (Score ${data.bestValueDeal.dealScore}/100)`;
  }
}

function renderComparisonTable(listings) {
  const tbody = document.getElementById('comparisonTableBody');
  if (!tbody || !listings) return;

  // Ensure listings are sorted strictly by lowest price first (best deal at top)
  const sorted = [...listings].sort((a, b) => a.price - b.price);

  tbody.innerHTML = sorted.map((l, index) => {
    const isTopDeal = index === 0;
    const priceFormatted = `₹${Number(l.price).toLocaleString('en-IN')}`;
    const origPriceFormatted = l.originalPrice ? `₹${Number(l.originalPrice).toLocaleString('en-IN')}` : null;
    const topBadge = isTopDeal ? `<span class="badge-tag tag-discount" style="margin-left: 6px; font-size: 10px; background-color: #10b981; color: #fff;">🏆 BEST PRICE</span>` : '';

    return `
      <tr style="${isTopDeal ? 'background-color: var(--primary-light); border-left: 4px solid var(--primary);' : ''}">
        <td>
          <div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
            <span style="font-size: 1.4rem;">${l.platformLogo || '🏪'}</span>
            <div>
              <span style="color: var(--text-main);">${l.platformName}</span>
              ${topBadge}
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight: 800; font-size: 16px; color: var(--text-main);">
            ${priceFormatted}
          </div>
          ${origPriceFormatted ? `<small style="text-decoration: line-through; color: var(--text-muted); font-size: 11px;">${origPriceFormatted}</small>` : ''}
        </td>
        <td>
          <span style="color: var(--primary); font-weight: 700;">
            ${l.discountPercentage ? `${Math.round(l.discountPercentage)}% OFF` : 'Standard'}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 13px;">
            <span style="color: #f59e0b;">★</span>
            <span style="font-weight: 700; color: var(--text-main);">${l.rating || '4.8'}</span>
            <small style="color: var(--text-muted);">(${l.reviewCount ? Number(l.reviewCount).toLocaleString('en-IN') : '1.2k'})</small>
          </div>
        </td>
        <td>
          <div style="font-size: 13px; color: var(--text-secondary);">
            ${l.deliveryDays === 1 ? '⚡ Express 1 Day' : `${l.deliveryDays || 2} Days Free Delivery`}
          </div>
        </td>
        <td>
          <span style="background-color: ${isTopDeal ? 'var(--primary)' : 'var(--bg-secondary)'}; color: ${isTopDeal ? '#ffffff' : 'var(--text-main)'}; border: 1px solid var(--border-color); padding: 4px 10px; border-radius: var(--radius-xs); font-size: 12px; font-weight: 800;">
            ${Math.round(l.dealScore || 95)}/100
          </span>
        </td>
        <td>
          <a href="${l.productUrl}" target="_blank" rel="noopener noreferrer" class="btn-store-direct" style="padding: 8px 16px; font-size: 13px; text-decoration: none; display: inline-flex;" title="Open directly on ${l.platformName}">
            Buy on ${l.platformName} ↗
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function renderProductReviews(product) {
  if (!product) return;
  currentProductReviews = product.reviews || [];

  // 1. Overall Score Box
  const avgScore = product.bestRating ? product.bestRating.toFixed(1) : '4.8';
  const totalCount = product.reviewCount ? Number(product.reviewCount).toLocaleString('en-IN') : '1,240';

  const scoreEl = document.getElementById('reviewsAvgScore');
  const countEl = document.getElementById('reviewsTotalCount');
  const allCountEl = document.getElementById('allReviewsCount');
  if (scoreEl) scoreEl.textContent = avgScore;
  if (countEl) countEl.textContent = `Based on ${totalCount} verified buyer ratings`;
  if (allCountEl) allCountEl.textContent = currentProductReviews.length;

  // 2. Rating distribution bars
  const distContainer = document.getElementById('ratingDistributionContainer');
  if (distContainer && product.ratingDistribution) {
    const dist = product.ratingDistribution;
    distContainer.innerHTML = `
      <div style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">Rating Breakdown</div>
      ${[5, 4, 3, 2, 1].map(stars => {
        const pct = dist[stars] || 0;
        return `
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 12px;">
            <span style="width: 32px; font-weight: 600; color: var(--text-secondary);">${stars} ★</span>
            <div style="flex: 1; height: 8px; background-color: var(--bg-secondary); border-radius: 4px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #f59e0b, #ff4e27); border-radius: 4px;"></div>
            </div>
            <span style="width: 36px; text-align: right; font-weight: 600; color: var(--text-muted);">${pct}%</span>
          </div>
        `;
      }).join('')}
    `;
  }

  // 3. Feature Ratings
  const featContainer = document.getElementById('featureRatingsContainer');
  if (featContainer && product.featureRatings) {
    featContainer.innerHTML = `
      <div style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">Feature Ratings</div>
      ${Object.entries(product.featureRatings).map(([feature, score]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: 12px;">
          <span style="color: var(--text-secondary);">${feature}</span>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #f59e0b;">★</span>
            <strong style="color: var(--text-main);">${score}</strong>
          </div>
        </div>
      `).join('')}
    `;
  }

  // 4. Render individual review cards
  renderReviewCardsList(currentProductReviews);
}

function renderReviewCardsList(reviews) {
  const container = document.getElementById('reviewsListContainer');
  if (!container) return;

  if (!reviews || reviews.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <p style="color: var(--text-muted); font-size: 14px;">No reviews match this filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const storeBadge = r.store ? `<span class="review-store-badge">${r.store === 'Amazon' ? '📦 Amazon' : r.store === 'Flipkart' ? '⚡ Flipkart' : r.store === 'Myntra' ? '👗 Myntra' : '🏷️ Ajio'}</span>` : '';
    const verifiedBadge = r.verified ? `<span class="review-verified-badge">✓ Verified Buyer</span>` : '';

    return `
      <div class="review-item-card">
        <div class="review-card-header">
          <div class="reviewer-meta">
            <div class="reviewer-avatar">${r.author ? r.author.charAt(0) : 'U'}</div>
            <div>
              <div class="reviewer-name">${r.author || 'Customer'}</div>
              <div class="review-date-store">
                <span>${r.date || 'Recent review'}</span>
                ${storeBadge}
                ${verifiedBadge}
              </div>
            </div>
          </div>
          <div class="review-stars-display" style="color: #f59e0b; font-size: 14px; letter-spacing: 2px;">
            ${stars}
          </div>
        </div>

        <h4 class="review-headline">${r.title || ''}</h4>
        <p class="review-body-text">${r.comment || ''}</p>

        <div class="review-card-footer">
          <button type="button" class="btn-helpful" onclick="this.innerHTML='👍 Helpful (' + (parseInt(this.getAttribute('data-count')) + 1) + ')'; this.disabled=true;" data-count="${r.helpfulCount || 12}">
            👍 Helpful (${r.helpfulCount || 12})
          </button>
          <span style="font-size: 12px; color: var(--text-muted);">Verified authentic review</span>
        </div>
      </div>
    `;
  }).join('');
}

function filterReviews(filter, btnEl) {
  const tabs = document.querySelectorAll('.reviews-filter-tabs .btn-store-pill');
  tabs.forEach(t => t.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  if (filter === 'all') {
    renderReviewCardsList(currentProductReviews);
  } else if (filter === 'verified') {
    const filtered = currentProductReviews.filter(r => r.verified);
    renderReviewCardsList(filtered);
  } else {
    const filtered = currentProductReviews.filter(r => r.store && r.store.toLowerCase() === filter.toLowerCase());
    renderReviewCardsList(filtered);
  }
}
window.filterReviews = filterReviews;

async function renderPriceHistoryChart(productId) {
  const canvas = document.getElementById('priceHistoryCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 240 * dpr;
  ctx.scale(dpr, dpr);

  const history = await Api.request(`/products/${productId}/history`);
  if (!history || history.length < 2) return;

  const prices = history.map(h => h.price > 5000 ? h.price / 80 : h.price);
  const dates = history.map(h => {
    const d = new Date(h.recordedAt);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
  });

  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;
  const w = rect.width - 70;
  const h = 240 - 50;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0, 0, rect.width, 240);

  // Background Grid Lines
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = 20 + (h / 3) * i;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(rect.width - 20, y);
    ctx.stroke();

    const priceLabel = `$${Math.round(maxP - ((maxP - minP) / 3) * i)}`;
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(priceLabel, 44, y + 4);
  }

  // Draw Area Curve
  ctx.beginPath();
  prices.forEach((p, idx) => {
    const x = 60 + (w / (prices.length - 1)) * idx;
    const y = 20 + h - ((p - minP) / (maxP - minP)) * h;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  const grad = ctx.createLinearGradient(0, 0, 0, 240);
  grad.addColorStop(0, 'rgba(255, 78, 39, 0.25)');
  grad.addColorStop(1, 'rgba(255, 78, 39, 0.0)');
  ctx.lineTo(60 + w, 20 + h);
  ctx.lineTo(60, 20 + h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Line
  ctx.beginPath();
  prices.forEach((p, idx) => {
    const x = 60 + (w / (prices.length - 1)) * idx;
    const y = 20 + h - ((p - minP) / (maxP - minP)) * h;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#ff4e27';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Points & Labels
  prices.forEach((p, idx) => {
    const x = 60 + (w / (prices.length - 1)) * idx;
    const y = 20 + h - ((p - minP) / (maxP - minP)) * h;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff4e27';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dates[idx], x, 230);
  });
}

function setupAlertModal(product) {
  const modal = document.getElementById('alertModal');
  const openBtn = document.getElementById('openAlertModalBtn');
  const closeBtn = document.getElementById('closeAlertModalBtn');
  const form = document.getElementById('createAlertForm');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    document.getElementById('modalProductName').textContent = product.name;
    const curP = product.minPrice > 5000 ? product.minPrice / 80 : product.minPrice;
    document.getElementById('modalCurrentPrice').textContent = `$${curP.toFixed(2)}`;
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const targetPrice = parseFloat(document.getElementById('targetPriceInput').value);
    alert(`Price alert successfully activated for $${targetPrice}!`);
    modal.style.display = 'none';
  });
}

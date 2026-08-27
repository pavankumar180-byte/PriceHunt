/**
 * ============================================================================
 * PRICEHUNT COMPARISON & PRICE HISTORY ENGINE
 * Renders cross-platform matrix, calculates deal scores, and draws history graphs
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  setupProductComparisonPage();
});

async function setupProductComparisonPage() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || '1';

  try {
    const data = await Api.request(`/compare/${productId}`);
    renderProductDetails(data);
    renderComparisonTable(data.rankedListings);
    renderPriceHistoryChart(productId);
    setupAlertModal(data.product);
  } catch (err) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--danger);">
        <h2>Product not found</h2>
        <p>Could not load comparison data for this item.</p>
        <a href="search.html" class="btn btn-primary" style="margin-top: 1rem;">Back to Search</a>
      </div>
    `;
  }
}

function renderProductDetails(data) {
  const p = data.product;
  document.getElementById('productImage').src = p.imageUrl;
  document.getElementById('productTitle').textContent = p.name;
  document.getElementById('productCategory').textContent = `${p.category} • ${p.brand}`;
  document.getElementById('productDescription').textContent = p.description;

  // Render Key Specs
  const specsContainer = document.getElementById('productSpecsList');
  if (specsContainer && p.specsJson) {
    try {
      const specs = typeof p.specsJson === 'string' ? JSON.parse(p.specsJson) : p.specsJson;
      specsContainer.innerHTML = Object.entries(specs).map(([k, v]) => `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color); font-size: 0.9rem;">
          <span style="color: var(--text-muted); text-transform: capitalize;">${k}</span>
          <strong>${v}</strong>
        </div>
      `).join('');
    } catch (e) {
      specsContainer.innerHTML = '';
    }
  }

  // Summary Badges
  if (data.lowestPriceDeal) {
    document.getElementById('lowestPriceDisplay').textContent = `₹${data.lowestPriceDeal.price.toLocaleString('en-IN')}`;
    document.getElementById('lowestPriceStore').textContent = `on ${data.lowestPriceDeal.platformName}`;
  }

  if (data.bestValueDeal) {
    document.getElementById('bestDealDisplay').textContent = `₹${data.bestValueDeal.price.toLocaleString('en-IN')}`;
    document.getElementById('bestDealStore').textContent = `on ${data.bestValueDeal.platformName} (${data.bestValueDeal.dealScore}/100)`;
  }
}

function renderComparisonTable(listings) {
  const tbody = document.getElementById('comparisonTableBody');
  if (!tbody) return;

  tbody.innerHTML = listings.map(l => {
    const isBestP = l.isBestPrice;
    const isBestD = l.isBestDeal;
    const rowClass = isBestD ? 'highlight-best-deal' : (isBestP ? 'highlight-best-price' : '');

    return `
      <tr class="${rowClass}">
        <td>
          <div class="platform-cell">
            <img src="${l.platformLogo || 'https://placehold.co/32x32'}" alt="${l.platformName}" class="platform-logo-img" onerror="this.src='https://placehold.co/32x32?text=Store'">
            <div>
              <div>${l.platformName}</div>
              <small style="color: var(--text-muted); font-size: 0.75rem;">Trust: ${l.platformTrustScore || 4.5} ★</small>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight: 800; font-size: 1.15rem; color: var(--secondary);">
            ₹${l.price.toLocaleString('en-IN')}
          </div>
          ${l.originalPrice > l.price ? `<small style="text-decoration: line-through; color: var(--text-light);">₹${l.originalPrice.toLocaleString('en-IN')}</small>` : ''}
        </td>
        <td>
          <span style="color: var(--success-dark); font-weight: 700;">
            ${l.discountPercentage ? `${Math.round(l.discountPercentage)}% OFF` : '—'}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            <span style="color: #f59e0b;">★</span>
            <strong>${l.rating || '4.5'}</strong>
            <small style="color: var(--text-muted);">(${l.reviewCount || 0})</small>
          </div>
        </td>
        <td>
          <div>${l.deliveryCost === 0 ? '<strong style="color: var(--success);">FREE</strong>' : `₹${l.deliveryCost}`}</div>
          <small style="color: var(--text-muted); font-size: 0.8rem;">${l.deliveryDays || 2} Days</small>
        </td>
        <td>
          <div class="deal-score-badge" title="Calculated multi-factor deal score">
            ⚡ ${l.dealScore || 90}/100
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <a href="${l.productUrl}" target="_blank" rel="noopener noreferrer" class="btn ${isBestD || isBestP ? 'btn-primary' : 'btn-secondary'} btn-sm">
              Visit Store ➔
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Draw HTML5 Canvas Price History Chart
async function renderPriceHistoryChart(productId) {
  const canvas = document.getElementById('priceHistoryCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const history = await Api.request(`/products/${productId}/history`);

  if (!history || history.length === 0) return;

  // Simple clean native canvas chart renderer
  const prices = history.map(h => h.price);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;

  const width = canvas.width = canvas.parentElement.clientWidth || 700;
  const height = canvas.height = 240;
  const padding = 40;

  ctx.clearRect(0, 0, width, height);

  // Background Grid Lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (i * (height - 2 * padding) / 4);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    const priceLabel = Math.round(maxP - (i * (maxP - minP) / 4));
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`₹${priceLabel.toLocaleString('en-IN')}`, 5, y + 4);
  }

  // Draw Price Trend Line
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();

  const points = [];
  history.forEach((h, index) => {
    const x = padding + (index * (width - 2 * padding) / (history.length - 1));
    const y = height - padding - ((h.price - minP) / (maxP - minP) * (height - 2 * padding));
    points.push({ x, y, price: h.price, date: new Date(h.recordedAt).toLocaleDateString() });

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Dots
  points.forEach(p => {
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Date Label
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText(p.date, p.x - 20, height - 15);
  });
}

function setupAlertModal(product) {
  const alertBtn = document.getElementById('openAlertModalBtn');
  const modal = document.getElementById('alertModal');
  const closeBtn = document.getElementById('closeAlertModalBtn');
  const form = document.getElementById('createAlertForm');

  if (!alertBtn || !modal) return;

  alertBtn.addEventListener('click', () => {
    const user = Api.getUser();
    if (!user) {
      alert('Please log in or create an account to configure price alerts.');
      window.location.href = 'login.html';
      return;
    }
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalCurrentPrice').textContent = `₹${(product.minPrice || 0).toLocaleString('en-IN')}`;
    document.getElementById('targetPriceInput').value = Math.round((product.minPrice || 0) * 0.9);
    modal.style.display = 'flex';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetPrice = parseFloat(document.getElementById('targetPriceInput').value);
      try {
        await Api.request('/alerts', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, targetPrice })
        });
        alert(`Price alert set! We will notify you when price drops below ₹${targetPrice.toLocaleString('en-IN')}.`);
        modal.style.display = 'none';
      } catch (err) {
        alert(err.message || 'Could not create price alert.');
      }
    });
  }
}

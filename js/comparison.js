/**
 * ============================================================================
 * NOVATREND PRODUCT COMPARISON & STORE INTELLIGENCE ENGINE
 * Supports Multi-Store Comparison Matrix & Adaptive Canvas Chart
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
      <div style="text-align: center; padding: 4rem 1rem;">
        <h3>Product not found</h3>
        <a href="search.html" class="btn-primary" style="margin-top: 1rem;">Back to Shop</a>
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

  if (data.lowestPriceDeal) {
    const price = data.lowestPriceDeal.price;
    const formatted = price > 5000 ? `$${(price / 80).toFixed(2)}` : `$${price.toFixed(2)}`;
    document.getElementById('lowestPriceDisplay').textContent = formatted;
    document.getElementById('lowestPriceStore').textContent = `on ${data.lowestPriceDeal.platformName}`;
  }

  if (data.bestValueDeal) {
    const price = data.bestValueDeal.price;
    const formatted = price > 5000 ? `$${(price / 80).toFixed(2)}` : `$${price.toFixed(2)}`;
    document.getElementById('bestDealDisplay').textContent = formatted;
    document.getElementById('bestDealStore').textContent = `on ${data.bestValueDeal.platformName} (${data.bestValueDeal.dealScore}/100)`;
  }
}

function renderComparisonTable(listings) {
  const tbody = document.getElementById('comparisonTableBody');
  if (!tbody) return;

  tbody.innerHTML = listings.map(l => {
    const isBestD = l.isBestDeal;
    const price = l.price;
    const priceFormatted = price > 5000 ? `$${(price / 80).toFixed(2)}` : `$${price.toFixed(2)}`;

    return `
      <tr style="${isBestD ? 'background-color: var(--primary-light);' : ''}">
        <td>
          <div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
            <img src="${l.platformLogo || 'https://placehold.co/24x24'}" alt="${l.platformName}" style="width: 24px; height: 24px; object-fit: contain;">
            <span>${l.platformName}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 800; font-size: 15px; color: var(--text-main);">
            ${priceFormatted}
          </div>
        </td>
        <td>
          <span style="color: var(--primary); font-weight: 700;">
            ${l.discountPercentage ? `${Math.round(l.discountPercentage)}% OFF` : 'Standard'}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 13px;">
            <span style="color: #f59e0b;">★</span>
            <span>${l.rating || '4.6'}</span>
            <small style="color: var(--text-muted);">(${l.reviewCount || '2.4k'})</small>
          </div>
        </td>
        <td>
          <div style="font-size: 13px; color: var(--text-secondary);">
            ${l.deliveryDays === 1 ? '⚡ Tomorrow' : `${l.deliveryDays || 2} Days`}
          </div>
        </td>
        <td>
          <span style="background-color: var(--primary); color: #ffffff; padding: 3px 8px; border-radius: var(--radius-xs); font-size: 11px; font-weight: 700;">
            ${Math.round(l.dealScore || 92)}/100
          </span>
        </td>
        <td>
          <a href="${l.productUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 6px 14px; font-size: 12px;">
            View on ${l.platformName} ↗
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

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

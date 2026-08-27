/**
 * ============================================================================
 * PRICEHUNT COMPARISON & SHOP PRICE HISTORY ENGINE
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
        <a href="search.html" class="pill-btn pill-btn-violet" style="margin-top: 1rem;">Back to Discover</a>
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
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--faint-border); font-size: 13px;">
          <span style="color: var(--muted-gray); text-transform: capitalize;">${k}</span>
          <span style="font-weight: 500;">${v}</span>
        </div>
      `).join('');
    } catch (e) {
      specsContainer.innerHTML = '';
    }
  }

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
    const rowClass = isBestD ? 'highlight-best-deal' : '';

    return `
      <tr class="${rowClass}">
        <td>
          <div style="display: flex; align-items: center; gap: 10px; font-weight: 500;">
            <img src="${l.platformLogo || 'https://placehold.co/24x24'}" alt="${l.platformName}" style="width: 24px; height: 24px; object-fit: contain;">
            <span>${l.platformName}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 600; font-size: 16px; color: var(--ink-black);">
            ₹${l.price.toLocaleString('en-IN')}
          </div>
        </td>
        <td>
          <span style="color: var(--shop-violet); font-weight: 500;">
            ${l.discountPercentage ? `${Math.round(l.discountPercentage)}% OFF` : '—'}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 13px;">
            <span style="color: var(--shop-violet);">★</span>
            <span>${l.rating || '4.5'}</span>
          </div>
        </td>
        <td>
          <div style="font-size: 13px;">${l.deliveryCost === 0 ? '<strong style="color: #065f46;">FREE</strong>' : `₹${l.deliveryCost}`}</div>
          <small style="color: var(--muted-gray); font-size: 11px;">${l.deliveryDays || 2} Days</small>
        </td>
        <td>
          <div class="shop-badge-deal">
            ⚡ ${l.dealScore || 90}
          </div>
        </td>
        <td>
          <a href="${l.productUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn ${isBestD || isBestP ? 'pill-btn-violet' : 'pill-btn-white'}" style="padding: 4px 14px; font-size: 12px;">
            Visit Store ➔
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
  const history = await Api.request(`/products/${productId}/history`);
  if (!history || history.length === 0) return;

  const prices = history.map(h => h.price);
  const minP = Math.min(...prices) * 0.96;
  const maxP = Math.max(...prices) * 1.04;

  const width = canvas.width = canvas.parentElement.clientWidth || 700;
  const height = canvas.height = 200;
  const padding = 40;

  ctx.clearRect(0, 0, width, height);

  // Subtle horizontal dividers
  ctx.strokeStyle = '#ebebeb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = padding + (i * (height - 2 * padding) / 3);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    const priceLabel = Math.round(maxP - (i * (maxP - minP) / 3));
    ctx.fillStyle = '#787574';
    ctx.font = '11px sans-serif';
    ctx.fillText(`₹${priceLabel.toLocaleString('en-IN')}`, 5, y + 4);
  }

  // Draw smooth violet line (#5433eb)
  ctx.strokeStyle = '#5433eb';
  ctx.lineWidth = 2.5;
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

  // Draw glowing points
  points.forEach(p => {
    ctx.fillStyle = '#5433eb';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#787574';
    ctx.font = '10px sans-serif';
    ctx.fillText(p.date, p.x - 16, height - 12);
  });
}

function setupAlertModal(product) {
  const alertBtn = document.getElementById('openAlertModalBtn');
  const modal = document.getElementById('alertModal');
  const closeBtn = document.getElementById('closeAlertModalBtn');
  const form = document.getElementById('createAlertForm');

  if (!alertBtn || !modal) return;

  alertBtn.addEventListener('click', () => {
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalCurrentPrice').textContent = `₹${(product.minPrice || 0).toLocaleString('en-IN')}`;
    document.getElementById('targetPriceInput').value = Math.round((product.minPrice || 0) * 0.9);
    modal.style.display = 'flex';
  });

  if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetPrice = parseFloat(document.getElementById('targetPriceInput').value);
      try {
        await Api.request('/alerts', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, targetPrice })
        });
        alert(`Price alert set for ₹${targetPrice.toLocaleString('en-IN')}!`);
        modal.style.display = 'none';
      } catch (err) {
        alert('Could not save alert.');
      }
    });
  }
}

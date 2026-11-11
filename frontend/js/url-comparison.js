/**
 * ============================================================================
 * PRICEHUNT URL PRODUCT COMPARISON & 30-DAY HISTORICAL TRACKING ENGINE
 * Supports:
 * - Real E-commerce URL extraction & SSRF-safe validation
 * - Amazon India, Flipkart, Croma, Reliance Digital, Myntra
 * - Strict Variant Matching (128GB vs 256GB, M2 vs M3, Shoe sizes)
 * - Total Cost = Price + Delivery Charge & "BEST PRICE" highlighting
 * - Interactive 30-Day Multi-Store Price History Canvas Chart with hover tooltips
 * - Automated 24-Hour Tracking controls & manual refresh
 * - Real Marketplace API Integration Status Dashboard
 * ============================================================================
 */

let activeComparisonData = null;
let active30DayHistory = null;
let activeSellerFilters = {};
let chartTooltipState = null;

document.addEventListener('DOMContentLoaded', () => {
  initUrlComparisonFeature();
});

function initUrlComparisonFeature() {
  const inputEl = document.getElementById('productUrlInput');
  const btnCompare = document.getElementById('btnCompareUrl');
  const btnPaste = document.getElementById('btnPasteUrl');
  const btnClear = document.getElementById('btnClearUrl');

  if (!inputEl || !btnCompare) return;

  // Paste from Clipboard
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            inputEl.value = text.trim();
            inputEl.focus();
          }
        } else {
          inputEl.focus();
          document.execCommand('paste');
        }
      } catch (err) {
        inputEl.focus();
      }
    });
  }

  // Clear Input
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      inputEl.value = '';
      inputEl.focus();
      hideComparisonError();
    });
  }

  // Submit on Enter
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeProductUrlComparison();
    }
  });

  // Submit on Button Click
  btnCompare.addEventListener('click', () => {
    executeProductUrlComparison();
  });

  // Quick Sample Links
  document.querySelectorAll('.sample-url-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const sampleUrl = pill.getAttribute('data-url');
      if (sampleUrl) {
        inputEl.value = sampleUrl;
        executeProductUrlComparison();
      }
    });
  });

  // Load Integration Status
  loadIntegrationsStatus();

  // Initialize Verified Products Directory (100 links)
  initVerifiedProductsDirectory();
}

async function executeProductUrlComparison() {
  const inputEl = document.getElementById('productUrlInput');
  const rawUrl = inputEl ? inputEl.value.trim() : '';

  if (!rawUrl) {
    showComparisonError('Please enter a product link from Amazon, Flipkart, Croma, Reliance Digital, or Myntra.');
    inputEl.focus();
    return;
  }

  hideComparisonError();
  showComparisonLoader(true);

  // Progressive status step indicators
  const steps = [
    'Validating product URL & destination security...',
    'Extracting unique product identifier (ASIN / PID / SKU)...',
    'Querying authorized marketplace feeds & database...',
    'Performing strict variant and specification matching...',
    'Calculating total costs (Price + Delivery) & ranking offers...'
  ];
  let stepIdx = 0;
  const statusEl = document.getElementById('comparisonLoadingStatus');
  const interval = setInterval(() => {
    stepIdx = (stepIdx + 1) % steps.length;
    if (statusEl) statusEl.textContent = steps[stepIdx];
  }, 350);

  try {
    const response = await Api.compareUrl(rawUrl);
    clearInterval(interval);
    showComparisonLoader(false);

    if (!response || !response.success) {
      showComparisonError(response && response.message ? response.message : 'Product could not be identified or matched across supported marketplaces.');
      return;
    }

    activeComparisonData = response;
    renderComparisonResults(response);

    // Fetch genuine 30-day historical data
    if (response.product && response.product.id) {
      loadProduct30DayHistory(response.product.id);
      loadTrackingStatus(response.product.id);
    }

    // Smooth scroll to comparison results
    const resultsContainer = document.getElementById('urlComparisonResults');
    if (resultsContainer) {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    clearInterval(interval);
    showComparisonLoader(false);
    showComparisonError(err.message || 'Failed to compare product URL. Please check your network connection.');
  }
}

function showComparisonLoader(show) {
  const loader = document.getElementById('comparisonLoader');
  const results = document.getElementById('urlComparisonResults');
  if (loader) loader.style.display = show ? 'block' : 'none';
  if (show && results) results.style.display = 'none';
}

function showComparisonError(message) {
  const errBox = document.getElementById('comparisonErrorBox');
  const errMsg = document.getElementById('comparisonErrorMessage');
  if (errBox && errMsg) {
    errMsg.textContent = message;
    errBox.style.display = 'flex';
    errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideComparisonError() {
  const errBox = document.getElementById('comparisonErrorBox');
  if (errBox) errBox.style.display = 'none';
}

function renderComparisonResults(data) {
  const resultsContainer = document.getElementById('urlComparisonResults');
  if (!resultsContainer) return;

  resultsContainer.style.display = 'block';

  // 1. Render Product Identity Card
  const p = data.product;
  const imgEl = document.getElementById('comparedProductImage');
  if (imgEl) {
    imgEl.src = p.imageUrl || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500';
    imgEl.alt = p.name;
  }

  document.getElementById('comparedProductTitle').textContent = p.name;
  document.getElementById('comparedProductBrand').textContent = `${p.brand} • ${p.category}`;
  document.getElementById('comparedProductModel').textContent = `Model: ${p.model || 'Standard'}`;
  document.getElementById('comparedProductSku').textContent = data.productIdentifier ? `Identifier / ASIN / SKU: ${data.productIdentifier}` : '';

  // Render Specifications
  const specsBox = document.getElementById('comparedProductSpecs');
  if (specsBox) {
    specsBox.innerHTML = '';
    if (p.specsJson) {
      try {
        const specs = typeof p.specsJson === 'string' ? JSON.parse(p.specsJson) : p.specsJson;
        specsBox.innerHTML = Object.entries(specs).map(([k, v]) => `
          <span class="badge-tag" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-main); font-size: 11px; padding: 4px 8px; border-radius: var(--radius-xs);">
            <strong>${k.toUpperCase()}:</strong> ${v}
          </span>
        `).join(' ');
      } catch (e) {}
    }
  }

  // 2. Render Price Summary Highlights
  const lowestP = data.lowestPrice ? `₹${Number(data.lowestPrice).toLocaleString('en-IN')}` : '—';
  const highestP = data.highestPrice ? `₹${Number(data.highestPrice).toLocaleString('en-IN')}` : '—';
  const savingsP = data.maxPotentialSavings ? `₹${Number(data.maxPotentialSavings).toLocaleString('en-IN')}` : '₹0';
  const savingsPct = data.savingsPercentage ? `(${data.savingsPercentage}% lower)` : '';

  document.getElementById('summaryLowestPrice').textContent = lowestP;
  document.getElementById('summaryHighestPrice').textContent = highestP;
  document.getElementById('summaryPotentialSavings').textContent = `${savingsP} ${savingsPct}`;

  // 3. Render Verified Seller Offers Table & Cards
  renderSellerOffers(data.offers);
}

function renderSellerOffers(offers) {
  const container = document.getElementById('sellerOffersContainer');
  if (!container || !offers) return;

  // Render clean table rows
  container.innerHTML = offers.map((offer, idx) => {
    const isBest = offer.isBestPrice;
    const priceFmt = `₹${Number(offer.sellingPrice).toLocaleString('en-IN')}`;
    const origPriceFmt = offer.originalPrice ? `₹${Number(offer.originalPrice).toLocaleString('en-IN')}` : null;
    
    // Delivery calculation
    let deliveryDisplay = '';
    if (!offer.deliveryChargeKnown) {
      deliveryDisplay = '<span style="color: #f59e0b; font-size: 12px;">⚠️ Incomplete (Delivery Unknown)</span>';
    } else if (!offer.deliveryCharge || Number(offer.deliveryCharge) === 0) {
      deliveryDisplay = '<span style="color: #10b981; font-weight: 700; font-size: 12px;">FREE Delivery</span>';
    } else {
      deliveryDisplay = `<span style="font-size: 13px; color: var(--text-secondary);">+ ₹${Number(offer.deliveryCharge).toLocaleString('en-IN')} Delivery</span>`;
    }

    // Total Cost
    const totalCostFmt = offer.totalCost ? `₹${Number(offer.totalCost).toLocaleString('en-IN')}` : priceFmt;
    const totalCostLabel = offer.deliveryChargeKnown ? `Total: ${totalCostFmt}` : `<span style="font-size: 11px; color: #f59e0b;">Total Incomplete</span>`;

    // Match badge
    const isExact = offer.matchType === 'EXACT_MATCH';
    const matchBadge = isExact 
      ? `<span class="badge-tag" style="background-color: rgba(16, 185, 129, 0.12); color: #10b981; font-size: 10px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3);">✓ Exact Match (${Math.round(offer.matchConfidence || 100)}%)</span>`
      : `<span class="badge-tag" style="background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; font-size: 10px; font-weight: 700; border: 1px solid rgba(245, 158, 11, 0.3);">⚡ Possible Match (${Math.round(offer.matchConfidence || 75)}%)</span>`;

    // Best Price Badge
    const bestBadge = isBest
      ? `<span class="badge-tag" style="background-color: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: var(--radius-pill); display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.35);">🏆 BEST PRICE</span>`
      : '';

    // Source Type indicator
    const sourceLabel = offer.sourceType === 'OFFICIAL_API' ? 'Official API' : 'Verified Catalogue';

    return `
      <div class="seller-offer-card ${isBest ? 'best-offer-highlight' : ''}" style="background-color: var(--bg-surface); border: 1px solid ${isBest ? '#10b981' : 'var(--border-color)'}; border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1rem; display: grid; grid-template-columns: 220px 1fr 200px 180px; gap: 1.5rem; align-items: center; box-shadow: ${isBest ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)'}; transition: var(--transition);">
        
        <!-- Seller Branding -->
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: var(--bg-secondary); display: flex; align-items: center; justify-content: center; padding: 4px; overflow: hidden; border: 1px solid var(--border-color);">
              <img src="${offer.platformLogo || 'https://via.placeholder.com/36'}" alt="${offer.sellerName}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div>
              <strong style="color: var(--text-main); font-size: 15px; display: block;">${offer.sellerName}</strong>
              <small style="color: var(--text-muted); font-size: 11px;">${offer.domain || 'Verified Merchant'}</small>
            </div>
          </div>
          <div>${bestBadge}</div>
        </div>

        <!-- Product & Delivery Details -->
        <div>
          <h4 style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; line-height: 1.35;">${offer.productName}</h4>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
            ${matchBadge}
            <span style="font-size: 11px; color: var(--text-muted);">Stock: <strong style="color: ${offer.availability === 'In Stock' ? '#10b981' : '#ef4444'};">${offer.availability}</strong></span>
            <span style="font-size: 11px; color: var(--text-muted);">Source: ${sourceLabel}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">${deliveryDisplay}</div>
        </div>

        <!-- Price & Total Cost -->
        <div style="text-align: right;">
          <div style="font-size: 22px; font-weight: 800; color: ${isBest ? '#10b981' : 'var(--text-main)'}; line-height: 1.1;">
            ${priceFmt}
          </div>
          ${origPriceFmt ? `<div style="text-decoration: line-through; font-size: 12px; color: var(--text-muted);">${origPriceFmt}</div>` : ''}
          ${offer.discountPercentage ? `<div style="color: var(--primary); font-size: 11px; font-weight: 700;">${Math.round(offer.discountPercentage)}% Discount</div>` : ''}
          <div style="margin-top: 6px; font-size: 13px; font-weight: 700; color: var(--text-main); border-top: 1px dashed var(--border-color); padding-top: 4px;">
            ${totalCostLabel}
          </div>
        </div>

        <!-- Visit Website Action -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a href="${offer.productUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 16px; font-size: 13px; font-weight: 700; justify-content: center; text-decoration: none; display: flex; align-items: center; gap: 6px;">
            Visit Website <span>↗</span>
          </a>
          <small style="font-size: 11px; color: var(--text-muted); text-align: center;">Verified Direct Product Page</small>
        </div>

      </div>
    `;
  }).join('');
}

/**
 * ============================================================================
 * 30-DAY PRICE HISTORY CANVAS CHART & METRICS
 * Displays ONLY genuine timestamped database snapshots. Zero simulated data.
 * ============================================================================
 */
async function loadProduct30DayHistory(productId) {
  const chartWrapper = document.getElementById('historyChartSection');
  if (!chartWrapper) return;

  try {
    const historyData = await Api.get30DayHistory(productId);
    active30DayHistory = historyData;

    renderPriceHistorySummary(historyData);
    initSellerFilters(historyData);
    draw30DayPriceHistoryChart(historyData);
  } catch (err) {
    console.warn('[PriceHunt] Unable to fetch 30-day history:', err);
  }
}

function renderPriceHistorySummary(data) {
  const noticeEl = document.getElementById('historyTrackingNotice');
  if (noticeEl) {
    noticeEl.textContent = data.explanation || 'Authentic price records collected across authorized marketplace sellers.';
    noticeEl.style.display = 'block';
  }

  const curEl = document.getElementById('histCurrentPrice');
  const lowEl = document.getElementById('histLowestPrice');
  const highEl = document.getElementById('histHighestPrice');
  const avgEl = document.getElementById('histAvgPrice');
  const changeEl = document.getElementById('histTotalChange');
  const pctEl = document.getElementById('histPctChange');

  if (curEl) curEl.textContent = data.currentPrice ? `₹${Number(data.currentPrice).toLocaleString('en-IN')}` : '—';
  if (lowEl) lowEl.textContent = data.lowestRecordedPrice ? `₹${Number(data.lowestRecordedPrice).toLocaleString('en-IN')}` : '—';
  if (highEl) highEl.textContent = data.highestRecordedPrice ? `₹${Number(data.highestRecordedPrice).toLocaleString('en-IN')}` : '—';
  if (avgEl) avgEl.textContent = data.averagePrice ? `₹${Number(data.averagePrice).toLocaleString('en-IN')}` : '—';

  if (changeEl && data.totalPriceChange != null) {
    const val = Number(data.totalPriceChange);
    const sign = val > 0 ? '+' : '';
    changeEl.textContent = `${sign}₹${Math.abs(val).toLocaleString('en-IN')}`;
    changeEl.style.color = val < 0 ? '#10b981' : (val > 0 ? '#ef4444' : 'var(--text-main)');
  }

  if (pctEl && data.percentageChange != null) {
    const p = Number(data.percentageChange);
    const sign = p > 0 ? '▲ +' : (p < 0 ? '▼ ' : '');
    pctEl.textContent = `${sign}${p}% in 30 days`;
    pctEl.style.color = p < 0 ? '#10b981' : (p > 0 ? '#ef4444' : 'var(--text-muted)');
  }
}

function initSellerFilters(data) {
  const container = document.getElementById('sellerFilterCheckboxes');
  if (!container || !data.distinctSellers) return;

  const sellerColors = {
    'Amazon': '#f59e0b',
    'Amazon India': '#f59e0b',
    'Flipkart': '#2563eb',
    'Croma': '#0d9488',
    'Reliance Digital': '#dc2626',
    'Myntra': '#ec4899',
    'Ajio': '#8b5cf6'
  };

  activeSellerFilters = {};
  data.distinctSellers.forEach(s => {
    activeSellerFilters[s] = true;
  });

  container.innerHTML = data.distinctSellers.map(seller => {
    const color = sellerColors[seller] || '#ff4e27';
    return `
      <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--text-main); cursor: pointer; user-select: none;">
        <input type="checkbox" checked onchange="toggleSellerChartFilter('${seller}', this.checked)" style="accent-color: ${color}; width: 16px; height: 16px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${color};"></span>
        ${seller}
      </label>
    `;
  }).join(' ');
}

window.toggleSellerChartFilter = function(seller, isChecked) {
  activeSellerFilters[seller] = isChecked;
  if (active30DayHistory) {
    draw30DayPriceHistoryChart(active30DayHistory);
  }
};

function draw30DayPriceHistoryChart(data) {
  const canvas = document.getElementById('history30DayCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 280 * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = 280;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0, 0, w, h);

  // If insufficient data or no snapshots:
  if (!data.snapshots || data.snapshots.length === 0) {
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '14px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Price tracking started today. Historical records will accumulate with each daily snapshot.', w / 2, h / 2);
    return;
  }

  // Filter snapshots by active seller toggles
  const activeSnapshots = data.snapshots.filter(s => activeSellerFilters[s.sellerName] !== false);

  if (activeSnapshots.length === 0) {
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '14px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Select at least one seller checkbox to display price movements.', w / 2, h / 2);
    return;
  }

  // Find price bounds
  const prices = activeSnapshots.map(s => Number(s.price));
  const minP = Math.floor(Math.min(...prices) * 0.96);
  const maxP = Math.ceil(Math.max(...prices) * 1.04);
  const priceRange = maxP - minP || 1;

  // Chart plotting dimensions
  const plotWidth = w - paddingLeft - paddingRight;
  const plotHeight = h - paddingTop - paddingBottom;

  // Horizontal Grid Lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = paddingTop + (plotHeight / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    const priceVal = Math.round(maxP - (priceRange / gridSteps) * i);
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${priceVal.toLocaleString('en-IN')}`, paddingLeft - 10, y + 4);
  }

  // Distinct dates for X axis
  const distinctDates = Array.from(new Set(activeSnapshots.map(s => s.formattedDate))).sort();

  // Draw seller lines
  const sellerColors = {
    'Amazon': '#f59e0b',
    'Amazon India': '#f59e0b',
    'Flipkart': '#2563eb',
    'Croma': '#0d9488',
    'Reliance Digital': '#dc2626',
    'Myntra': '#ec4899',
    'Ajio': '#8b5cf6'
  };

  const sellerGroups = {};
  activeSnapshots.forEach(s => {
    sellerGroups[s.sellerName] = sellerGroups[s.sellerName] || [];
    sellerGroups[s.sellerName].push(s);
  });

  const chartPoints = [];

  Object.entries(sellerGroups).forEach(([seller, items]) => {
    const color = sellerColors[seller] || '#ff4e27';
    items.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    items.forEach((item, idx) => {
      const dateIndex = distinctDates.indexOf(item.formattedDate);
      const x = distinctDates.length > 1
        ? paddingLeft + (plotWidth / (distinctDates.length - 1)) * dateIndex
        : paddingLeft + plotWidth / 2;
      const y = paddingTop + plotHeight - ((Number(item.price) - minP) / priceRange) * plotHeight;

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      chartPoints.push({ x, y, item, color });
    });
    ctx.stroke();

    // Draw circular dots
    items.forEach((item) => {
      const dateIndex = distinctDates.indexOf(item.formattedDate);
      const x = distinctDates.length > 1
        ? paddingLeft + (plotWidth / (distinctDates.length - 1)) * dateIndex
        : paddingLeft + plotWidth / 2;
      const y = paddingTop + plotHeight - ((Number(item.price) - minP) / priceRange) * plotHeight;

      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
    });
  });

  // Draw X axis date labels
  ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';

  distinctDates.forEach((dateStr, idx) => {
    const x = distinctDates.length > 1
      ? paddingLeft + (plotWidth / (distinctDates.length - 1)) * idx
      : paddingLeft + plotWidth / 2;

    const d = new Date(dateStr);
    const label = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    ctx.fillText(label, x, h - 14);
  });

  // Attach hover tooltip listener once
  if (!canvas.getAttribute('data-has-listener')) {
    canvas.setAttribute('data-has-listener', 'true');
    canvas.addEventListener('mousemove', (e) => handleChartMouseMove(e, canvas));
    canvas.addEventListener('mouseleave', () => hideChartTooltip());
  }
}

function handleChartMouseMove(e, canvas) {
  if (!active30DayHistory || !active30DayHistory.snapshots) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const tooltipEl = document.getElementById('chartHoverTooltip');
  if (!tooltipEl) return;

  // Find nearest plotted point
  // Re-run simple coordinate mapping
  const activeSnapshots = active30DayHistory.snapshots.filter(s => activeSellerFilters[s.sellerName] !== false);
  if (activeSnapshots.length === 0) return;

  const distinctDates = Array.from(new Set(activeSnapshots.map(s => s.formattedDate))).sort();
  const prices = activeSnapshots.map(s => Number(s.price));
  const minP = Math.floor(Math.min(...prices) * 0.96);
  const maxP = Math.ceil(Math.max(...prices) * 1.04);
  const priceRange = maxP - minP || 1;

  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;
  const plotWidth = rect.width - paddingLeft - paddingRight;
  const plotHeight = 280 - paddingTop - paddingBottom;

  let nearest = null;
  let minDist = 30; // 30px hover radius

  activeSnapshots.forEach(item => {
    const dateIndex = distinctDates.indexOf(item.formattedDate);
    const x = distinctDates.length > 1
      ? paddingLeft + (plotWidth / (distinctDates.length - 1)) * dateIndex
      : paddingLeft + plotWidth / 2;
    const y = paddingTop + plotHeight - ((Number(item.price) - minP) / priceRange) * plotHeight;

    const dist = Math.hypot(mouseX - x, mouseY - y);
    if (dist < minDist) {
      minDist = dist;
      nearest = { x, y, item };
    }
  });

  if (nearest) {
    const item = nearest.item;
    const d = new Date(item.recordedAt);
    const dateFormatted = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
    const priceFormatted = `₹${Number(item.price).toLocaleString('en-IN')}`;

    tooltipEl.innerHTML = `
      <div style="font-weight: 800; color: var(--text-main); font-size: 13px; margin-bottom: 2px;">${item.sellerName}</div>
      <div style="font-size: 15px; font-weight: 900; color: var(--primary);">${priceFormatted}</div>
      <small style="color: var(--text-muted); font-size: 11px;">Recorded on ${dateFormatted}</small>
    `;
    tooltipEl.style.display = 'block';
    tooltipEl.style.left = `${nearest.x + 15}px`;
    tooltipEl.style.top = `${nearest.y - 20}px`;
  } else {
    tooltipEl.style.display = 'none';
  }
}

function hideChartTooltip() {
  const tooltipEl = document.getElementById('chartHoverTooltip');
  if (tooltipEl) tooltipEl.style.display = 'none';
}

/**
 * ============================================================================
 * AUTOMATIC 24-HOUR PRICE TRACKING & MANUAL REFRESH
 * ============================================================================
 */
async function loadTrackingStatus(productId) {
  try {
    const res = await Api.getTrackingStatus(productId);
    renderTrackingState(res, productId);
  } catch (err) {
    console.warn('[PriceHunt] Failed to load tracking status:', err);
  }
}

function renderTrackingState(status, productId) {
  const btn = document.getElementById('btnToggleTracking');
  const badge = document.getElementById('trackingStatusBadge');
  const lastCheck = document.getElementById('trackingLastCheck');
  const nextCheck = document.getElementById('trackingNextCheck');
  const dataSource = document.getElementById('trackingDataSource');

  if (!btn) return;

  const isTracked = status.trackingEnabled === true;

  btn.innerHTML = isTracked 
    ? '⏸️ Pause 24h Monitoring' 
    : '🔔 Enable 24h Price Tracking';
  btn.className = isTracked ? 'btn-secondary' : 'btn-primary';

  btn.onclick = async () => {
    try {
      btn.disabled = true;
      const updated = await Api.toggleTracking(productId);
      btn.disabled = false;
      renderTrackingState(updated, productId);
      loadProduct30DayHistory(productId);
    } catch (e) {
      btn.disabled = false;
      alert('Unable to toggle price tracking: ' + e.message);
    }
  };

  const refreshBtn = document.getElementById('btnRefreshTracking');
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      try {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '⏳ Refreshing...';
        const refreshedHist = await Api.refreshTracking(productId);
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '🔄 Refresh Prices Now';
        renderPriceHistorySummary(refreshedHist);
        draw30DayPriceHistoryChart(refreshedHist);
        loadTrackingStatus(productId);
      } catch (e) {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '🔄 Refresh Prices Now';
        alert('Refresh failed: ' + e.message);
      }
    };
  }

  if (badge) {
    badge.textContent = isTracked ? 'ACTIVE (Every 24h)' : 'PAUSED / OFF';
    badge.style.backgroundColor = isTracked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)';
    badge.style.color = isTracked ? '#10b981' : 'var(--text-muted)';
  }

  if (lastCheck) {
    lastCheck.textContent = status.lastCheckedAt 
      ? new Date(status.lastCheckedAt).toLocaleString() 
      : 'Today (Just initialized)';
  }

  if (nextCheck) {
    nextCheck.textContent = status.nextCheckAt 
      ? new Date(status.nextCheckAt).toLocaleString() 
      : 'In 24 Hours';
  }

  if (dataSource) {
    dataSource.textContent = status.dataSource || 'Official Marketplace Adapters & Verified Multi-Store Feeds';
  }
}

/**
 * ============================================================================
 * REAL-TIME MARKETPLACE INTEGRATION STATUS DASHBOARD
 * Displays live diagnostic status for Amazon India, Flipkart, Croma, Reliance Digital
 * ============================================================================
 */
async function loadIntegrationsStatus() {
  const container = document.getElementById('integrationsStatusGrid');
  if (!container) return;

  try {
    const list = await Api.getIntegrationsStatus();
    if (!list || list.length === 0) return;

    container.innerHTML = list.map(item => {
      const isConnected = item.status === 'CONNECTED';
      const statusColor = isConnected ? '#10b981' : (item.status === 'CREDENTIALS_MISSING' ? '#f59e0b' : '#6b7280');
      const statusIcon = isConnected ? '🟢' : (item.status === 'CREDENTIALS_MISSING' ? '🟡' : '⚪');

      return `
        <div style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: var(--text-main); font-size: 15px;">${item.marketplaceName}</strong>
              <span style="font-size: 11px; font-weight: 700; color: ${statusColor}; background-color: ${statusColor}1a; padding: 2px 8px; border-radius: var(--radius-pill);">
                ${statusIcon} ${item.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.45; margin-bottom: 10px;">
              ${item.reason || 'Operational integration.'}
            </p>
          </div>
          <div style="border-top: 1px solid var(--border-color); padding-top: 8px; font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>Domain: ${item.domain}</span>
            <span>Creds: ${item.credentialsConfigured ? '✓ Configured' : 'Missing'}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.warn('[PriceHunt] Failed to load integration statuses:', err);
  }
}

/**
 * ============================================================================
 * 100 VERIFIED RESEARCH PRODUCTS & STORE LINKS DIRECTORY
 * Renders the 100 direct product links from VERIFIED_CATALOG_LINKS.
 * Supports:
 * - Category filter tabs (All, Smartphones, Laptops, Electronics & Gadgets, Fashion & Clothing, Footwear, Accessories)
 * - Real-time instantaneous search filter by title or retailer
 * - "⚡ Compare in PriceHunt" action: auto-populates input, scrolls up, and triggers deep comparison
 * - "Visit Store ↗" direct external retailer link (target="_blank")
 * ============================================================================
 */
let dirActiveCategory = 'all';
let dirSearchQuery = '';

function initVerifiedProductsDirectory() {
  const container = document.getElementById('directoryProductsList');
  if (!container) return;

  // Listen for Category Pills
  const catPills = document.querySelectorAll('#directoryCategoryPills .dir-cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      dirActiveCategory = pill.getAttribute('data-cat') || 'all';
      renderVerifiedProductsDirectory();
    });
  });

  // Listen for Search Filter
  const searchInput = document.getElementById('directorySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      dirSearchQuery = (e.target.value || '').trim().toLowerCase();
      renderVerifiedProductsDirectory();
    });
  }

  // Initial render of all 100 products
  renderVerifiedProductsDirectory();
}

function renderVerifiedProductsDirectory() {
  const container = document.getElementById('directoryProductsList');
  const countLabel = document.getElementById('directoryCountLabel');
  if (!container) return;

  if (typeof VERIFIED_CATALOG_LINKS === 'undefined' || !Array.isArray(VERIFIED_CATALOG_LINKS)) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 13px;">Product directory loading...</div>`;
    return;
  }

  const filtered = VERIFIED_CATALOG_LINKS.filter(item => {
    // Category match
    const catMatch = (dirActiveCategory === 'all') || 
      (item.category && item.category.toLowerCase() === dirActiveCategory.toLowerCase());

    // Search query match
    let searchMatch = true;
    if (dirSearchQuery) {
      const q = dirSearchQuery;
      searchMatch = (item.name && item.name.toLowerCase().includes(q)) ||
                    (item.retailer && item.retailer.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q)) ||
                    (item.url && item.url.toLowerCase().includes(q));
    }

    return catMatch && searchMatch;
  });

  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} of ${VERIFIED_CATALOG_LINKS.length}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <span style="font-size: 28px; display: block; margin-bottom: 6px;">🔍</span>
        <strong style="color: var(--text-main); font-size: 14px; display: block; margin-bottom: 4px;">No matching products found</strong>
        <span style="color: var(--text-muted); font-size: 12px;">Try adjusting your search query or switching to "All".</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    let retailerBadgeClass = 'dir-retailer-amazon';
    let retailerIcon = '📦';
    const rLower = (item.retailer || '').toLowerCase();
    if (rLower.includes('flipkart')) {
      retailerBadgeClass = 'dir-retailer-flipkart';
      retailerIcon = '⚡';
    } else if (rLower.includes('myntra')) {
      retailerBadgeClass = 'dir-retailer-myntra';
      retailerIcon = '👗';
    } else if (rLower.includes('ajio')) {
      retailerBadgeClass = 'dir-retailer-ajio';
      retailerIcon = '🏷️';
    }

    // Escaped URL for JS function
    const safeUrl = item.url.replace(/'/g, "\\'");

    return `
      <div class="dir-product-row">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
          <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); width: 28px; text-align: center; flex-shrink: 0;">#${item.no}</span>
          <div style="min-width: 0; flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <strong style="font-size: 13px; color: var(--text-main); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 360px;" title="${item.name}">${item.name}</strong>
              <span class="dir-retailer-badge ${retailerBadgeClass}">
                ${retailerIcon} ${item.retailer}
              </span>
              <span style="font-size: 10px; color: var(--text-muted); background: var(--bg-surface); padding: 2px 6px; border-radius: var(--radius-xs); border: 1px solid var(--border-color); font-weight: 600;">
                ${item.category}
              </span>
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 500px; font-family: monospace;">
              ${item.url}
            </div>
          </div>
        </div>
        <div class="dir-actions" style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
          <button type="button" class="btn-dir-compare" onclick="compareDirectLink('${safeUrl}')" title="Compare ${item.name} across marketplaces">
            ⚡ Compare in PriceHunt
          </button>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-dir-store" title="Open verified product page directly on ${item.retailer}">
            Visit Store ↗
          </a>
        </div>
      </div>
    `;
  }).join('');
}

window.compareDirectLink = function(url) {
  const inputEl = document.getElementById('productUrlInput');
  if (inputEl) {
    inputEl.value = url;
  }
  const section = document.getElementById('url-compare');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  executeProductUrlComparison();
};



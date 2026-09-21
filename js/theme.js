/**
 * ============================================================================
 * NOVATREND STOREFRONT INTERACTION ENGINE
 * Theme Engine (Dark & Light Mode), Dynamic Countdown, Cart & Wishlist
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initCountdownTimer();
  initWishlistAndCart();
});

/* --------------------------------------------------------------------------
   1. Dark & Light Mode Theme Engine
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const savedTheme = localStorage.getItem('novatrend_theme') || 'light';
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
  localStorage.setItem('novatrend_theme', theme);
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

  // Handle Quick Add buttons
  document.querySelectorAll('.btn-quick-add, .btn-add-cart-circle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let cartCount = parseInt(localStorage.getItem('novatrend_cart_count') || '0');
      cartCount++;
      localStorage.setItem('novatrend_cart_count', cartCount);
      updateBadges();

      // Quick feedback animation
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Added';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 1200);
    });
  });

  // Handle Wishlist toggles
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      let favCount = parseInt(localStorage.getItem('novatrend_fav_count') || '0');
      if (btn.classList.contains('active')) {
        favCount++;
      } else {
        favCount = Math.max(0, favCount - 1);
      }
      localStorage.setItem('novatrend_fav_count', favCount);
      updateBadges();
    });
  });
}

function updateBadges() {
  const cartBadge = document.getElementById('cartBadgeCount');
  const favBadge = document.getElementById('favBadgeCount');

  const cartCount = localStorage.getItem('novatrend_cart_count') || '0';
  const favCount = localStorage.getItem('novatrend_fav_count') || '0';

  if (cartBadge) cartBadge.textContent = cartCount;
  if (favBadge) favBadge.textContent = favCount;
}

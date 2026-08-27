/**
 * ============================================================================
 * PRICEHUNT AUTHENTICATION & SESSION CONTROLLER
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavState();
  setupLoginForm();
  setupSignupForm();
  setupForgotPasswordForm();
  setupResetPasswordForm();
  setupProfileForm();
});

// Update navbar based on login status
function setupNavState() {
  const user = Api.getUser();
  const navActions = document.getElementById('navActions');
  if (!navActions) return;

  if (user) {
    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <a href="dashboard.html" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 0.4rem;">
          <span>👤</span> ${user.name.split(' ')[0]}
        </a>
        <button id="logoutBtn" class="btn btn-outline btn-sm">Log Out</button>
      </div>
    `;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => Api.logout());
    }
  } else {
    navActions.innerHTML = `
      <a href="login.html" class="btn btn-secondary">Log In</a>
      <a href="signup.html" class="btn btn-primary">Sign Up</a>
    `;
  }
}

// Login Form Handling
function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');

  // Toggle password visibility
  const toggleBtn = document.getElementById('togglePassword');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showAlert(alertBox, 'Please provide both email and password.', 'danger');
      return;
    }

    setLoading(submitBtn, true, 'Logging in...');

    try {
      const res = await Api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      Api.setToken(res.token);
      Api.setUser({ id: res.id, name: res.name, email: res.email, role: res.role });
      showAlert(alertBox, 'Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } catch (err) {
      showAlert(alertBox, err.message || 'Invalid email or password.', 'danger');
    } finally {
      setLoading(submitBtn, false, 'Sign In');
    }
  });
}

// Sign Up Form Handling
function setupSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('terms');
  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name || !email || !password) {
      showAlert(alertBox, 'Please fill in all required fields.', 'danger');
      return;
    }

    if (password.length < 6) {
      showAlert(alertBox, 'Password must be at least 6 characters.', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showAlert(alertBox, 'Passwords do not match.', 'danger');
      return;
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      showAlert(alertBox, 'Please agree to the Terms & Conditions.', 'danger');
      return;
    }

    setLoading(submitBtn, true, 'Creating Account...');

    try {
      const res = await Api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      Api.setToken(res.token);
      Api.setUser({ id: res.id, name: res.name, email: res.email, role: res.role });
      showAlert(alertBox, 'Account created successfully! Welcome to PriceHunt.', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } catch (err) {
      showAlert(alertBox, err.message || 'Failed to create account.', 'danger');
    } finally {
      setLoading(submitBtn, false, 'Create Account');
    }
  });
}

// Forgot Password
function setupForgotPasswordForm() {
  const form = document.getElementById('forgotPasswordForm');
  if (!form) return;

  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    setLoading(submitBtn, true, 'Sending link...');

    try {
      await Api.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      showAlert(alertBox, `Reset link sent to ${email}. Check your inbox.`, 'success');
    } catch (err) {
      showAlert(alertBox, 'Error dispatching reset link.', 'danger');
    } finally {
      setLoading(submitBtn, false, 'Send Reset Link');
    }
  });
}

// Reset Password
function setupResetPasswordForm() {
  const form = document.getElementById('resetPasswordForm');
  if (!form) return;

  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword.length < 6) {
      showAlert(alertBox, 'Password must be at least 6 characters.', 'danger');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showAlert(alertBox, 'Passwords do not match.', 'danger');
      return;
    }

    setLoading(submitBtn, true, 'Updating password...');
    try {
      await Api.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });
      showAlert(alertBox, 'Password updated! Redirecting to login...', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    } catch (err) {
      showAlert(alertBox, err.message || 'Error updating password.', 'danger');
    } finally {
      setLoading(submitBtn, false, 'Reset Password');
    }
  });
}

// User Profile
async function setupProfileForm() {
  const profileContainer = document.getElementById('profileContainer');
  if (!profileContainer) return;

  const user = Api.getUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const profile = await Api.request('/user/profile');
    document.getElementById('profileName').value = profile.name;
    document.getElementById('profileEmail').value = profile.email;
    document.getElementById('profileFavCount').textContent = profile.favoritesCount || 0;
    document.getElementById('profileAlertCount').textContent = profile.activeAlertsCount || 0;
  } catch (e) {
    console.warn(e);
  }
}

// Helper utilities
function showAlert(el, msg, type = 'danger') {
  if (!el) return;
  el.className = `alert-box ${type}`;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideAlert(el) {
  if (!el) return;
  el.style.display = 'none';
}

function setLoading(btn, isLoading, text) {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = text;
}

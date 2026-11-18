<template>
  <div class="website">

    <!-- HEADER -->
    <header class="header">
      <RouterLink to="/" class="logo">Lost&amp;Found</RouterLink>

      <!-- Desktop Nav -->
      <nav class="navigation desktop-nav">
        <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
        <RouterLink to="/listing">{{ $t('nav.listing') }}</RouterLink>
        <RouterLink to="/report">{{ $t('nav.report') }}</RouterLink>
        <RouterLink to="/track-claim">{{ $t('nav.trackClaim') }}</RouterLink>
        <RouterLink to="/review">{{ $t('nav.review') }}</RouterLink>
      </nav>

      <!-- Right controls -->
      <div class="header-right">
        <button type="button" @click="toggleLang" class="lang-btn">
          🌐 {{ locale === 'bn' ? 'EN' : 'বাং' }}
        </button>

        <RouterLink v-if="!hasToken" to="/login" class="login-btn desktop-only">
          {{ $t('nav.login') }}
        </RouterLink>
        <button v-else @click="handleLogout" class="login-btn logout-btn desktop-only">
          {{ $t('nav.logout') }}
        </button>

        <!-- Hamburger (mobile only) -->
        <button
          type="button"
          class="hamburger"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <!-- Mobile Drawer -->
    <div v-if="menuOpen" class="mobile-overlay" @click="menuOpen = false"></div>
    <nav v-if="menuOpen" class="mobile-nav">
      <RouterLink to="/"            @click="menuOpen = false">{{ $t('nav.home') }}</RouterLink>
      <RouterLink to="/listing"     @click="menuOpen = false">{{ $t('nav.listing') }}</RouterLink>
      <RouterLink to="/report"      @click="menuOpen = false">{{ $t('nav.report') }}</RouterLink>
      <RouterLink to="/track-claim" @click="menuOpen = false">{{ $t('nav.trackClaim') }}</RouterLink>
      <RouterLink to="/review"      @click="menuOpen = false">{{ $t('nav.review') }}</RouterLink>

      <div class="mobile-nav-footer">
        <RouterLink
          v-if="!hasToken"
          to="/login"
          class="btn btn-primary btn-block"
          @click="menuOpen = false"
        >
          🔐 {{ $t('nav.login') }}
        </RouterLink>
        <button
          v-else
          type="button"
          class="btn btn-danger btn-block"
          @click="handleLogout(); menuOpen = false"
        >
          🚪 {{ $t('nav.logout') }}
        </button>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <p>© 2026 Campus Lost &amp; Found System. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { setLocale } from './i18n'
import { authToken, removeAuthToken } from './api'

const { locale } = useI18n()
const router = useRouter()
const menuOpen = ref(false)

const hasToken = computed(() => !!authToken.value)

function toggleLang() {
  const next = locale.value === 'bn' ? 'en' : 'bn'
  setLocale(next)
}

function handleLogout() {
  removeAuthToken()
  router.push('/login')
}
</script>

<style>
/* ── Layout ── */
.website { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; }

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 12px;
}

.logo {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  text-decoration: none;
  flex-shrink: 0;
}

/* ── Desktop Nav ── */
.desktop-nav {
  display: flex;
  gap: 4px;
  flex: 1;
  justify-content: center;
  flex-wrap: nowrap;
}

.desktop-nav a {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.88rem;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s;
  white-space: nowrap;
}

.desktop-nav a:hover,
.desktop-nav a.router-link-active {
  color: #2563eb;
  background: #EEF4FF;
  font-weight: 600;
}

/* ── Header Right ── */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.lang-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 5px 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  color: #334155;
  white-space: nowrap;
}

.login-btn {
  background: #2563eb;
  color: #ffffff !important;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.login-btn:hover { background: #1d4ed8; }
.logout-btn { background: #ef4444; }
.logout-btn:hover { background: #dc2626; }

/* ── Hamburger ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: #334155;
  border-radius: 2px;
  transition: all 0.2s;
}

/* ── Mobile Nav Drawer ── */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 150;
}

.mobile-nav {
  display: none;
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 12px 28px rgba(0,0,0,0.12);
  z-index: 200;
  flex-direction: column;
  padding: 10px 0 16px;
}

.mobile-nav a {
  display: block;
  padding: 12px 24px;
  color: #334155;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.15s;
}

.mobile-nav a:hover,
.mobile-nav a.router-link-active {
  color: #2563eb;
  background: #EEF4FF;
  border-left-color: #2563eb;
  font-weight: 600;
}

.mobile-nav-footer {
  padding: 12px 20px 4px;
  border-top: 1px solid #f1f5f9;
  margin-top: 8px;
}

.mobile-nav-footer .btn-block {
  width: 100%;
  text-align: center;
  display: block;
}

/* ── Footer ── */
.footer {
  text-align: center;
  padding: 20px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 13px;
  margin-top: 40px;
}

/* ── Responsive breakpoint ── */
@media (max-width: 768px) {
  .header { padding: 0 14px; }
  .desktop-nav { display: none; }
  .desktop-only { display: none; }
  .hamburger { display: flex; }
  .mobile-overlay { display: block; }
  .mobile-nav { display: flex; }
}

@media (max-width: 480px) {
  .lang-btn { padding: 4px 8px; font-size: 11px; }
  .logo { font-size: 17px; }
}
</style>

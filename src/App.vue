<template>
  <div class="website">
    <header class="header">
      <RouterLink to="/" class="logo">🔎 Lost&amp;Found</RouterLink>

      <nav class="navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/listing">Listing</RouterLink>
        <RouterLink to="/report">Report</RouterLink>
        <RouterLink to="/track-claim">Track Claim</RouterLink>
        <RouterLink to="/review">Review</RouterLink>
      </nav>

      <RouterLink to="/login" class="login-btn">Login</RouterLink>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>© 2026 VU Lost &amp; Found. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

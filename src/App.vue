
<template>
  <div class="website">

    <!-- HEADER -->
    <header class="header">

      <div class="logo">
        Lost&Found
      </div>

      <nav class="navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/listing">Listing</RouterLink>
        <RouterLink to="/report">Report</RouterLink>
        <RouterLink to="/track-page">Track Claim</RouterLink>
      </nav>

      <RouterLink to="/login" class="login-btn">
        Login
      </RouterLink>

    </header>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <p>© 2026 My Website. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

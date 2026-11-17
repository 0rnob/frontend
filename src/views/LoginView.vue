
<template>
  <div class="page">
    <h1>Login Page</h1>

    <form @submit.prevent="login">
      <input
        type="email"
        placeholder="Enter your email"
        required
      />

      <input
        type="password"
        placeholder="Enter your password"
        required
      />

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
function login() {
  alert('Login button clicked!')
}
</script>

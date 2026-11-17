<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

// DEMO ONLY: no real authentication yet.
function login() {
  router.push('/review')
}
</script>

<template>
  <div class="page narrow">
    <form class="card auth-card" @submit.prevent="login">
      <h1>Login</h1>
      <p class="muted">Sign in to manage claims.</p>
      <label>Email
        <input v-model="email" type="email" placeholder="Enter your email" required />
      </label>
      <label>Password
        <input v-model="password" type="password" placeholder="Enter your password" required />
      </label>
      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
  </div>
</template>

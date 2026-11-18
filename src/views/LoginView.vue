<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '../api/index'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref('')

// Lockout countdown state
const isLocked = ref(false)
const remainingSec = ref(0)
let timer = null

function startCountdown(seconds) {
  isLocked.value = true
  remainingSec.value = seconds
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    remainingSec.value--
    if (remainingSec.value <= 0) {
      clearInterval(timer)
      timer = null
      isLocked.value = false
      error.value = ''
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function handleSubmit() {
  if (isLocked.value) return
  loading.value = true
  error.value = ''
  try {
    await loginApi(username.value, password.value)
    router.push('/review')
  } catch (err) {
    if (err.data && (err.data.locked || err.status === 429)) {
      const sec = err.data.retryAfterSeconds || 60
      startCountdown(sec)
      error.value = err.data.message || `Account locked due to too many failed attempts.`
    } else {
      error.value = err.message || 'Invalid username or password.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page narrow">
    <form class="card auth-card" @submit.prevent="handleSubmit">
      <div class="auth-logo">{{ isLocked ? '⏳' : '🔐' }}</div>
      <h1>{{ isLocked ? 'Login Locked' : $t('auth.loginTitle') }}</h1>
      <p class="muted">
        {{ isLocked
          ? `Too many failed attempts. Please wait ${remainingSec}s before retrying.`
          : $t('auth.loginSub') }}
      </p>

      <!-- Lockout Alert Box -->
      <div v-if="isLocked" class="lock-alert">
        <span class="lock-icon">🚫</span>
        <div>
          <strong>একাউন্ট সাময়িকভাবে লক করা হয়েছে</strong>
          <p>অতিরিক্ত ভুল চেষ্টার কারণে লগইন স্থগিত। আর <strong>{{ remainingSec }} সেকেন্ড</strong> পর পুনরায় চেষ্টা করতে পারবেন।</p>
        </div>
      </div>

      <!-- Error message -->
      <p v-else-if="error" class="error-msg">⚠️ {{ error }}</p>

      <label>
        {{ $t('auth.username') }}
        <input
          v-model.trim="username"
          type="text"
          placeholder="admin"
          autocomplete="username"
          :disabled="isLocked"
          required
        />
      </label>

      <label class="pass-label">
        {{ $t('auth.password') }}
        <div class="pass-wrap">
          <input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="isLocked"
            required
          />
          <button
            type="button"
            class="eye-btn"
            :aria-label="showPass ? 'Hide password' : 'Show password'"
            @click="showPass = !showPass"
          >
            <!-- eye open -->
            <svg v-if="!showPass" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <!-- eye off -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
      </label>

      <button
        type="submit"
        class="btn btn-primary btn-block"
        :disabled="loading || isLocked"
      >
        <span v-if="isLocked">⏳ Locked ({{ remainingSec }}s)</span>
        <span v-else>{{ loading ? $t('auth.processing') : $t('auth.loginBtn') }}</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-card {
  max-width: 400px;
  margin: 60px auto;
  padding: 36px 32px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-logo {
  font-size: 2.2rem;
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #1A1F36;
}

.muted {
  margin: 0;
  text-align: center;
  color: #5A627A;
  font-size: 0.88rem;
}

.lock-alert {
  background: #FEF2F2;
  border: 1.5px solid #FCA5A5;
  color: #991B1B;
  padding: 12px 14px;
  border-radius: 10px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 0.84rem;
  line-height: 1.45;
}

.lock-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.lock-alert p {
  margin: 4px 0 0;
}

.error-msg {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 0;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1A1F36;
}

label input {
  padding: 11px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #F8FAFC;
  color: #1A1F36;
  outline: none;
  transition: border-color 0.2s;
}

label input:focus {
  border-color: #2B59C3;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(43, 89, 195, 0.1);
}

label input:disabled {
  background: #F1F5F9;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Password field with eye button */
.pass-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.pass-wrap input {
  width: 100%;
  padding-right: 44px;
  box-sizing: border-box;
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #5A627A;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.eye-btn:hover {
  color: #2B59C3;
}

.btn-primary {
  background: #2B59C3;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1e449c;
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-block { width: 100%; }
</style>

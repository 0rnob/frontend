<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getItem, submitClaim, setItemStatus, formatDate } from '../data/store'
import { getAuthToken } from '../api/index'

const route = useRoute()
const item = ref(null)
const loading = ref(true)

const form = ref({ name: '', studentId: '', email: '', proof: '' })
const claim = ref(null)
const copied = ref(false)
const submitting = ref(false)
const error = ref('')

const isFound = computed(() => item.value?.type === 'found')

onMounted(async () => {
  loading.value = true
  try {
    item.value = await getItem(route.params.id)
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  submitting.value = true
  error.value = ''
  try {
    const res = await submitClaim({ itemId: item.value.id, ...form.value })
    claim.value = res
  } catch (err) {
    error.value = err.message || 'Failed to submit claim.'
  } finally {
    submitting.value = false
  }
}

async function toggleStatus() {
  const next = item.value.status === 'returned' ? 'OPEN' : 'RETURNED'
  try {
    const updated = await setItemStatus(item.value.id, next)
    item.value = updated
  } catch (err) {
    alert(err.message || 'Failed to update item status')
  }
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(claim.value.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch { /* clipboard not available */ }
}
</script>

<template>
  <div class="page">
    <RouterLink to="/listing" class="back-link">{{ $t('detail.back') }}</RouterLink>

    <div v-if="loading" class="card empty">
      <p class="muted">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!item" class="card empty">
      <h2>{{ $t('detail.itemNotFound') }}</h2>
      <p>{{ $t('detail.itemNotFoundSub') }}</p>
    </div>

    <div v-else class="detail-grid">
      <!-- ITEM DETAILS -->
      <section class="card">
        <div class="item-card__top">
          <span class="badge" :class="item.type">{{ item.type === 'lost' ? $t('common.lost') : $t('common.found') }}</span>
          <span class="badge status">{{ item.status }}</span>
        </div>
        <h1>{{ item.name }}</h1>
        <p class="muted">{{ item.description }}</p>

        <dl class="info-list">
          <div><dt>{{ $t('detail.category') }}</dt><dd>{{ item.category }}</dd></div>
          <div><dt>{{ isFound ? $t('detail.dateFound') : $t('detail.dateLost') }}</dt><dd>{{ formatDate(item.date) }}</dd></div>
          <div><dt>{{ $t('detail.location') }}</dt><dd>{{ item.location }}</dd></div>
          <div><dt>{{ $t('detail.status') }}</dt><dd class="cap">{{ item.status }}</dd></div>
        </dl>

        <div v-if="getAuthToken()" style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
          <p style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase;">
            {{ $t('common.adminControls') }}
          </p>
          <button type="button" class="btn btn-outline" @click="toggleStatus">
            {{ item.status === 'returned' ? $t('detail.reopen') : $t('detail.markReturned') }}
          </button>
        </div>
      </section>

      <!-- CLAIM FORM / CLAIM CODE -->
      <section class="card">
        <!-- after submission: show the claim code -->
        <div v-if="claim" class="success-box">
          <div class="success-icon">✓</div>
          <h2>{{ $t('detail.claimSubmitted') }}</h2>
          <p class="muted">{{ $t('detail.saveCode') }}</p>
          <div class="claim-code">{{ claim.code }}</div>
          <button class="btn btn-outline" type="button" @click="copyCode">
            {{ copied ? $t('common.copied') : $t('common.copy') }}
          </button>
          <RouterLink :to="`/track-claim?code=${claim.code}`" class="btn btn-primary">
            {{ $t('detail.trackClaimBtn') }}
          </RouterLink>
        </div>

        <!-- item already handled -->
        <div v-else-if="item.status !== 'open'" class="empty">
          <h2>{{ $t('detail.notAvailable') }}</h2>
          <p class="muted">{{ $t('detail.notAvailableSub') }}</p>
        </div>

        <!-- claim form -->
        <form v-else @submit.prevent="onSubmit">
          <h2>{{ isFound ? $t('detail.claimTitleFound') : $t('detail.claimTitleLost') }}</h2>
          <p class="muted">
            {{ isFound ? $t('detail.claimSubFound') : $t('detail.claimSubLost') }}
          </p>

          <p v-if="error" class="error-msg" style="color: #ef4444; margin-bottom: 12px;">{{ error }}</p>

          <label>{{ $t('detail.fullName') }}
            <input v-model.trim="form.name" type="text" placeholder="Your full name" required />
          </label>
          <label>{{ $t('detail.studentId') }}
            <input v-model.trim="form.studentId" type="text" placeholder="e.g. 2026-1-60-001" required />
          </label>
          <label>{{ $t('detail.email') }}
            <input v-model.trim="form.email" type="email" placeholder="you@example.com" required />
          </label>
          <label>{{ isFound ? $t('detail.proofFound') : $t('detail.proofLost') }}
            <textarea
              v-model.trim="form.proof"
              rows="4"
              :placeholder="isFound ? $t('detail.proofFoundPlaceholder') : $t('detail.proofLostPlaceholder')"
              required
            ></textarea>
          </label>

          <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
            {{ submitting ? $t('report.submitting') : $t('detail.submitClaim') }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

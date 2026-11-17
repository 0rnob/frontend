<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getItem, submitClaim, formatDate } from '../data/store'

const route = useRoute()
const item = computed(() => getItem(route.params.id))

const form = ref({ name: '', studentId: '', email: '', proof: '' })
const claim = ref(null) // set after a successful submission
const copied = ref(false)

const isFound = computed(() => item.value?.type === 'found')

function onSubmit() {
  claim.value = submitClaim({ itemId: item.value.id, ...form.value })
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
    <RouterLink to="/listing" class="back-link">← Back to listing</RouterLink>

    <div v-if="!item" class="card empty">
      <h2>Item not found</h2>
      <p>This item may have been removed.</p>
    </div>

    <div v-else class="detail-grid">
      <!-- ITEM DETAILS -->
      <section class="card">
        <div class="item-card__top">
          <span class="badge" :class="item.type">{{ item.type === 'lost' ? 'Lost' : 'Found' }}</span>
          <span class="badge status">{{ item.status }}</span>
        </div>
        <h1>{{ item.name }}</h1>
        <p class="muted">{{ item.description }}</p>

        <dl class="info-list">
          <div><dt>Category</dt><dd>{{ item.category }}</dd></div>
          <div><dt>{{ isFound ? 'Date found' : 'Date lost' }}</dt><dd>{{ formatDate(item.date) }}</dd></div>
          <div><dt>Campus location</dt><dd>{{ item.location }}</dd></div>
          <div><dt>Status</dt><dd class="cap">{{ item.status }}</dd></div>
        </dl>
      </section>

      <!-- CLAIM FORM / CLAIM CODE -->
      <section class="card">
        <!-- after submission: show the claim code -->
        <div v-if="claim" class="success-box">
          <div class="success-icon">✓</div>
          <h2>Claim submitted!</h2>
          <p class="muted">Save this code. You will need it to check your claim status.</p>
          <div class="claim-code">{{ claim.code }}</div>
          <button class="btn btn-outline" type="button" @click="copyCode">
            {{ copied ? 'Copied ✓' : 'Copy code' }}
          </button>
          <RouterLink :to="`/track-claim?code=${claim.code}`" class="btn btn-primary">Track this claim</RouterLink>
        </div>

        <!-- item already handled -->
        <div v-else-if="item.status !== 'open'" class="empty">
          <h2>Not available</h2>
          <p class="muted">This item has already been {{ item.status }}, so new claims are closed.</p>
        </div>

        <!-- claim form -->
        <form v-else @submit.prevent="onSubmit">
          <h2>{{ isFound ? 'Claim this item' : 'I found this item' }}</h2>
          <p class="muted">
            {{ isFound
              ? 'Tell us why this item is yours. An admin will review your claim.'
              : 'Tell us where the item is now so the owner can be contacted.' }}
          </p>

          <label>Full name
            <input v-model.trim="form.name" type="text" placeholder="Your full name" required />
          </label>
          <label>Student ID
            <input v-model.trim="form.studentId" type="text" placeholder="e.g. 2026-1-60-001" required />
          </label>
          <label>Email
            <input v-model.trim="form.email" type="email" placeholder="you@example.com" required />
          </label>
          <label>{{ isFound ? 'Proof of ownership' : 'Where is the item now?' }}
            <textarea
              v-model.trim="form.proof"
              rows="4"
              :placeholder="isFound
                ? 'Describe something only the owner would know (contents, marks, serial number...)'
                : 'e.g. I handed it to the security office at the main gate'"
              required
            ></textarea>
          </label>

          <button type="submit" class="btn btn-primary btn-block">Submit claim</button>
        </form>
      </section>
    </div>
  </div>
</template>

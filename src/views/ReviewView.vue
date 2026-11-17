<script setup>
import { ref, computed } from 'vue'
import { getClaims, getItem, updateClaim, formatDate } from '../data/store'

const tab = ref('pending')
const claims = ref(getClaims())
const tabs = ['pending', 'approved', 'rejected', 'returned']

const shown = computed(() => claims.value.filter((c) => c.status === tab.value))
const count = (s) => claims.value.filter((c) => c.status === s).length

function change(code, status) {
  updateClaim(code, status)
  claims.value = getClaims()
}
</script>

<template>
  <div class="page">
    <h1>Claim Review Dashboard</h1>
    <p class="muted">Demo admin view: approve or reject claims and mark items as returned.</p>

    <div class="tabs">
      <button v-for="t in tabs" :key="t" type="button" :class="{ active: tab === t }" @click="tab = t">
        {{ t }} <span class="count">{{ count(t) }}</span>
      </button>
    </div>

    <div v-if="shown.length" class="claim-list">
      <article v-for="c in shown" :key="c.code" class="card claim-row">
        <div class="claim-row__main">
          <div class="claim-code small-code">{{ c.code }}</div>
          <h3>{{ getItem(c.itemId)?.name || 'Unknown item' }}</h3>
          <p class="muted small">
            {{ c.name }} · {{ c.studentId }} · {{ c.email }} · {{ formatDate(c.createdAt) }}
          </p>
          <p class="proof"><strong>Proof:</strong> {{ c.proof }}</p>
        </div>
        <div class="claim-row__actions">
          <template v-if="c.status === 'pending'">
            <button type="button" class="btn btn-primary" @click="change(c.code, 'approved')">Approve</button>
            <button type="button" class="btn btn-danger" @click="change(c.code, 'rejected')">Reject</button>
          </template>
          <button v-else-if="c.status === 'approved'" type="button" class="btn btn-primary" @click="change(c.code, 'returned')">
            Mark as returned
          </button>
        </div>
      </article>
    </div>
    <div v-else class="card empty">
      <h2>Nothing here</h2>
      <p class="muted">No {{ tab }} claims right now.</p>
    </div>
  </div>
</template>

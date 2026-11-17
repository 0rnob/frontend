<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getClaimByCode, getItem, formatDate } from '../data/store'

const route = useRoute()
const code = ref(route.query.code || '')
const claim = ref(null)
const searched = ref(false)

const item = computed(() => (claim.value ? getItem(claim.value.itemId) : null))

const steps = ['Submitted', 'Under review', 'Approved', 'Returned']
// how far along the timeline each status is
const stepIndex = computed(() => {
  const s = claim.value?.status
  return { pending: 1, approved: 2, returned: 3, rejected: 1 }[s] ?? 0
})

function lookup() {
  claim.value = getClaimByCode(code.value)
  searched.value = true
}
if (code.value) lookup()
</script>

<template>
  <div class="page narrow">
    <h1>Track Your Claim</h1>
    <p class="muted">Enter the claim code you received after submitting your claim.</p>

    <form class="card search-bar" @submit.prevent="lookup">
      <input v-model="code" type="text" placeholder="e.g. LF-7K3P9X" required />
      <button type="submit" class="btn btn-primary">Check status</button>
    </form>

    <div v-if="searched && !claim" class="card empty">
      <h2>No claim found</h2>
      <p class="muted">Please check the code and try again.</p>
    </div>

    <div v-if="claim" class="card">
      <div class="claim-head">
        <div>
          <span class="muted small">Claim code</span>
          <div class="claim-code small-code">{{ claim.code }}</div>
        </div>
        <span class="badge" :class="`s-${claim.status}`">{{ claim.status }}</span>
      </div>

      <ol v-if="claim.status !== 'rejected'" class="timeline">
        <li v-for="(s, i) in steps" :key="s" :class="{ done: i <= stepIndex, current: i === stepIndex }">
          <span class="dot">{{ i <= stepIndex ? '✓' : i + 1 }}</span>{{ s }}
        </li>
      </ol>
      <p v-else class="alert">Your claim was rejected. Contact the campus office if you think this is a mistake.</p>

      <dl v-if="item" class="info-list">
        <div><dt>Item</dt><dd><RouterLink :to="`/item/${item.id}`">{{ item.name }}</RouterLink></dd></div>
        <div><dt>Location</dt><dd>{{ item.location }}</dd></div>
        <div><dt>Claimed by</dt><dd>{{ claim.name }}</dd></div>
        <div><dt>Submitted</dt><dd>{{ formatDate(claim.createdAt) }}</dd></div>
      </dl>
    </div>
  </div>
</template>

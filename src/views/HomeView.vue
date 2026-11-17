<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getItems } from '../data/store'
import ItemCard from '../components/ItemCard.vue'

const router = useRouter()
const query = ref('')
const items = getItems()
const recent = computed(() => items.slice(0, 3))
const stats = computed(() => ({
  lost: items.filter((i) => i.type === 'lost').length,
  found: items.filter((i) => i.type === 'found').length,
  returned: items.filter((i) => i.status === 'returned').length,
}))

function search() {
  router.push({ path: '/listing', query: query.value ? { q: query.value } : {} })
}
</script>

<template>
  <div class="page">
    <section class="hero">
      <h1>Lost something on campus?</h1>
      <p>Search items that have been found, report a lost item, and track your claim — all in one place.</p>

      <form class="search-bar" @submit.prevent="search">
        <input v-model="query" type="text" placeholder="Search e.g. wallet, keys, ID card..." />
        <button type="submit" class="btn btn-primary">Search</button>
      </form>

      <div class="hero-actions">
        <RouterLink to="/report" class="btn btn-outline">Report an item</RouterLink>
        <RouterLink to="/listing" class="btn btn-outline">Browse all items</RouterLink>
      </div>
    </section>

    <section class="stats">
      <div class="stat"><strong>{{ stats.lost }}</strong><span>Lost reports</span></div>
      <div class="stat"><strong>{{ stats.found }}</strong><span>Found items</span></div>
      <div class="stat"><strong>{{ stats.returned }}</strong><span>Returned to owners</span></div>
    </section>

    <section>
      <div class="section-head">
        <h2>Recently reported</h2>
        <RouterLink to="/listing">View all →</RouterLink>
      </div>
      <div class="grid">
        <ItemCard v-for="item in recent" :key="item.id" :item="item" />
      </div>
    </section>

    <section class="steps">
      <h2>How it works</h2>
      <div class="grid">
        <div class="card"><div class="step-no">1</div><h3>Report or search</h3><p class="muted">Post a lost/found item or search the listing.</p></div>
        <div class="card"><div class="step-no">2</div><h3>Submit a claim</h3><p class="muted">Open the item and fill the claim form. You get a claim code.</p></div>
        <div class="card"><div class="step-no">3</div><h3>Track &amp; collect</h3><p class="muted">Use your code to see when the claim is approved.</p></div>
      </div>
    </section>
  </div>
</template>

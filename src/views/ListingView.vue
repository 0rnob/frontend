<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getItems, CATEGORIES, LOCATIONS } from '../data/store'
import ItemCard from '../components/ItemCard.vue'

const route = useRoute()
const items = getItems()

const search = ref(route.query.q || '')
const type = ref('all')
const category = ref('')
const location = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return items.filter((i) =>
    (type.value === 'all' || i.type === type.value) &&
    (!category.value || i.category === category.value) &&
    (!location.value || i.location === location.value) &&
    (!q || (i.name + ' ' + i.description).toLowerCase().includes(q)),
  )
})

function reset() {
  search.value = ''; type.value = 'all'; category.value = ''; location.value = ''
}
</script>

<template>
  <div class="page">
    <h1>Lost &amp; Found Items</h1>
    <p class="muted">Browse everything reported on campus. Open an item to claim it.</p>

    <div class="filters card">
      <input v-model="search" type="text" placeholder="Search items..." />
      <select v-model="type">
        <option value="all">Lost &amp; Found</option>
        <option value="lost">Lost only</option>
        <option value="found">Found only</option>
      </select>
      <select v-model="category">
        <option value="">All categories</option>
        <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
      </select>
      <select v-model="location">
        <option value="">All locations</option>
        <option v-for="l in LOCATIONS" :key="l">{{ l }}</option>
      </select>
      <button type="button" class="btn btn-outline" @click="reset">Reset</button>
    </div>

    <p class="result-count">{{ filtered.length }} item(s) found</p>

    <div v-if="filtered.length" class="grid">
      <ItemCard v-for="item in filtered" :key="item.id" :item="item" />
    </div>
    <div v-else class="card empty">
      <h2>No items match your search</h2>
      <p class="muted">Try different keywords or reset the filters.</p>
    </div>
  </div>
</template>

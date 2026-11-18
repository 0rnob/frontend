<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getItems, CATEGORIES, LOCATIONS } from '../data/store'
import ItemCard from '../components/ItemCard.vue'

const route = useRoute()
const items = ref([])
const loading = ref(true)

async function loadData() {
  loading.value = true
  try {
    items.value = await getItems()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const search = ref(route.query.q || '')
const type = ref('all')
const category = ref('')
const location = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return items.value.filter((i) =>
    (type.value === 'all' || i.type === type.value) &&
    (!category.value || i.category === category.value) &&
    (!location.value || i.location === location.value) &&
    (!q || (i.name + ' ' + (i.description || '')).toLowerCase().includes(q)),
  )
})

function reset() {
  search.value = ''; type.value = 'all'; category.value = ''; location.value = ''
}
</script>

<template>
  <div class="page">
    <h1>{{ $t('listing.title') }}</h1>
    <p class="muted">{{ $t('listing.subtitle') }}</p>

    <div class="filters card">
      <input v-model="search" type="text" :placeholder="$t('listing.searchPlaceholder')" />
      <select v-model="type">
        <option value="all">{{ $t('common.all') }}</option>
        <option value="lost">{{ $t('common.lost') }}</option>
        <option value="found">{{ $t('common.found') }}</option>
      </select>
      <select v-model="category">
        <option value="">{{ $t('listing.allCategories') }}</option>
        <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
      </select>
      <select v-model="location">
        <option value="">{{ $t('listing.allLocations') }}</option>
        <option v-for="l in LOCATIONS" :key="l">{{ l }}</option>
      </select>
      <button type="button" class="btn btn-outline" @click="reset">{{ $t('common.reset') }}</button>
    </div>

    <div v-if="loading" class="card empty">
      <p class="muted">{{ $t('common.loading') }}</p>
    </div>
    <template v-else>
      <p class="result-count">{{ $t('listing.itemsFound', { count: filtered.length }) }}</p>

      <div v-if="filtered.length" class="grid">
        <ItemCard v-for="item in filtered" :key="item.id" :item="item" />
      </div>
      <div v-else class="card empty">
        <h2>{{ $t('listing.noMatch') }}</h2>
        <p class="muted">{{ $t('listing.noMatchSub') }}</p>
      </div>
    </template>
  </div>
</template>

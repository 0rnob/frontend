<script setup>
import { formatDate } from '../data/store'
defineProps({ item: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="`/item/${item.id}`" class="item-card">
    <div class="item-card__top">
      <span class="badge" :class="item.type">{{ item.type === 'lost' ? $t('common.lost') : $t('common.found') }}</span>
      <span v-if="item.status !== 'open'" class="badge status">{{ item.status }}</span>
    </div>
    <h3>{{ item.name }}</h3>
    <p class="item-card__desc">{{ item.description }}</p>
    <div class="item-card__meta">
      <span>📍 {{ item.location }}</span>
      <span>📅 {{ formatDate(item.date) }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addItem, CATEGORIES, LOCATIONS } from '../data/store'

const router = useRouter()
const today = new Date().toISOString().slice(0, 10)
const form = ref({ type: 'lost', name: '', category: '', description: '', date: today, location: '' })

function onSubmit() {
  const item = addItem({ ...form.value })
  router.push(`/item/${item.id}`)
}
</script>

<template>
  <div class="page narrow">
    <h1>Report an Item</h1>
    <p class="muted">Fill in the details so the owner or finder can recognise the item.</p>

    <form class="card" @submit.prevent="onSubmit">
      <div class="toggle">
        <label :class="{ active: form.type === 'lost' }">
          <input v-model="form.type" type="radio" value="lost" /> I lost something
        </label>
        <label :class="{ active: form.type === 'found' }">
          <input v-model="form.type" type="radio" value="found" /> I found something
        </label>
      </div>

      <label>Item name
        <input v-model.trim="form.name" type="text" placeholder="e.g. Black wallet" required />
      </label>
      <label>Category
        <select v-model="form.category" required>
          <option value="" disabled>Select a category</option>
          <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
        </select>
      </label>
      <label>Description
        <textarea v-model.trim="form.description" rows="4" placeholder="Colour, brand, marks, contents..." required></textarea>
      </label>
      <div class="row">
        <label>Date
          <input v-model="form.date" type="date" :max="today" required />
        </label>
        <label>Campus location
          <select v-model="form.location" required>
            <option value="" disabled>Select a location</option>
            <option v-for="l in LOCATIONS" :key="l">{{ l }}</option>
          </select>
        </label>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit report</button>
    </form>
  </div>
</template>

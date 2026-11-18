<script setup>
import { ref } from 'vue'
import { addItem, CATEGORIES, LOCATIONS } from '../data/store'

const today = new Date().toISOString().slice(0, 10)
const defaultForm = () => ({
  type: 'lost',
  name: '',
  category: '',
  description: '',
  date: today,
  location: '',
  reporterName: '',
  reporterEmail: '',
})

const form = ref(defaultForm())
const submitting = ref(false)
const error = ref('')
const submittedItem = ref(null)

async function onSubmit() {
  submitting.value = true
  error.value = ''
  try {
    const item = await addItem({ ...form.value })
    if (item && item.id) {
      submittedItem.value = item
    } else {
      submittedItem.value = { ...form.value }
    }
  } catch (err) {
    error.value = err.message || 'Failed to submit report.'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.value = defaultForm()
  submittedItem.value = null
  error.value = ''
}
</script>

<template>
  <div class="page narrow report-page">

    <!-- SUCCESS CONFIRMATION STATE -->
    <div v-if="submittedItem" class="card success-card">
      <div class="success-icon">
        {{ submittedItem.type === 'lost' ? '📢' : '🎁' }}
      </div>
      <h2>
        {{ submittedItem.type === 'lost' ? $t('report.successLostTitle') : $t('report.successFoundTitle') }}
      </h2>
      <p class="muted success-desc">
        {{ submittedItem.type === 'lost' ? $t('report.successLostDesc') : $t('report.successFoundDesc') }}
      </p>

      <div class="summary-box">
        <div class="summary-row">
          <span class="s-label">{{ $t('report.itemName') }}:</span>
          <span class="s-val bold">{{ submittedItem.name }}</span>
        </div>
        <div class="summary-row">
          <span class="s-label">{{ $t('detail.status') }}:</span>
          <span class="badge" :class="submittedItem.type">
            {{ submittedItem.type === 'lost' ? $t('common.lost') : $t('common.found') }}
          </span>
        </div>
        <div class="summary-row">
          <span class="s-label">{{ $t('report.location') }}:</span>
          <span class="s-val">{{ submittedItem.location }}</span>
        </div>
        <div class="summary-row">
          <span class="s-label">{{ $t('report.date') }}:</span>
          <span class="s-val">{{ submittedItem.date }}</span>
        </div>
      </div>

      <div class="success-actions">
        <RouterLink to="/listing" class="btn btn-primary">
          {{ $t('report.viewInListing') }}
        </RouterLink>
        <button type="button" class="btn btn-outline" @click="resetForm">
          {{ $t('report.reportAnother') }}
        </button>
      </div>
    </div>

    <!-- REPORT FORM STATE -->
    <div v-else>
      <h1>{{ $t('report.title') }}</h1>
      <p class="muted">{{ $t('report.subtitle') }}</p>

      <form class="card form-card" @submit.prevent="onSubmit">
        <div class="toggle">
          <label :class="{ active: form.type === 'lost' }">
            <input v-model="form.type" type="radio" value="lost" /> {{ $t('report.iLost') }}
          </label>
          <label :class="{ active: form.type === 'found' }">
            <input v-model="form.type" type="radio" value="found" /> {{ $t('report.iFound') }}
          </label>
        </div>

        <p v-if="error" class="error-msg" style="color: #ef4444; margin-bottom: 12px;">{{ error }}</p>

        <label>{{ $t('report.itemName') }}
          <input v-model.trim="form.name" type="text" :placeholder="$t('report.itemNamePlaceholder')" required />
        </label>
        <label>{{ $t('report.category') }}
          <select v-model="form.category" required>
            <option value="" disabled>{{ $t('report.selectCategory') }}</option>
            <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
          </select>
        </label>
        <label>{{ $t('report.description') }}
          <textarea v-model.trim="form.description" rows="4" :placeholder="$t('report.descPlaceholder')" required></textarea>
        </label>
        <div class="row">
          <label>{{ $t('report.date') }}
            <input v-model="form.date" type="date" :max="today" required />
          </label>
          <label>{{ $t('report.location') }}
            <select v-model="form.location" required>
              <option value="" disabled>{{ $t('report.selectLocation') }}</option>
              <option v-for="l in LOCATIONS" :key="l">{{ l }}</option>
            </select>
          </label>
        </div>

        <div class="row">
          <label>{{ $t('report.yourName') }}
            <input v-model.trim="form.reporterName" type="text" :placeholder="$t('report.yourNamePlaceholder')" required />
          </label>
          <label>{{ $t('report.yourEmail') }}
            <input v-model.trim="form.reporterEmail" type="email" :placeholder="$t('report.yourEmailPlaceholder')" required />
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
          {{ submitting ? $t('report.submitting') : $t('report.submitBtn') }}
        </button>
      </form>
    </div>

  </div>
</template>

<style scoped>
.success-card {
  text-align: center;
  padding: 36px 28px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.success-icon {
  font-size: 3.5rem;
  margin-bottom: 14px;
}

.success-card h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
}

.success-desc {
  max-width: 480px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.summary-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 0 auto 26px;
  max-width: 440px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.s-label {
  color: #64748b;
  font-weight: 500;
}

.s-val {
  color: #1e293b;
}

.s-val.bold {
  font-weight: 700;
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .success-actions {
    flex-direction: column;
  }
  .success-actions .btn {
    width: 100%;
  }
}
</style>

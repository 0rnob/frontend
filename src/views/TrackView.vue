<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/* ==========================================================================
   1. LOCAL DATA STORE (NO EXTERNAL FILE REQUIRED)
   ========================================================================== */
// Items Database
const itemsDatabase = {
  'item-101': {
    id: 'item-101',
    name: 'Casio fx-991EX ClassWiz Calculator',
    category: 'Electronics',
    location: 'Central Library, 2nd Floor'
  },
  'item-102': {
    id: 'item-102',
    name: 'Black Leather Wallet (with Student ID)',
    category: 'Personal Belongings',
    location: 'Cafeteria Ground Counter'
  },
  'item-103': {
    id: 'item-103',
    name: 'Blue North Face Backpack',
    category: 'Bags & Luggage',
    location: 'Auditorium Gate 2'
  }
}

// Claims Database
const claimsDatabase = {
  'CLM-2026-00125': {
    code: 'CLM-2026-00125',
    itemId: 'item-101',
    status: 'pending',
    createdAt: new Date().toISOString(),
    note: 'Your claim is currently under physical inspection by Campus Security. Estimated verification: 24–48 hours.'
  },
  'CLM-2026-00089': {
    code: 'CLM-2026-00089',
    itemId: 'item-102',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    note: 'Claim verified! Please visit Room 104 with your valid Student ID card to collect your item.'
  },
  'CLM-2026-00042': {
    code: 'CLM-2026-00042',
    itemId: 'item-103',
    status: 'rejected',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    note: 'Verification failed. The provided serial details or markings did not match the recovered property.'
  }
}

// Helper Functions
function getClaimByCode(codeStr) {
  return claimsDatabase[codeStr] || null
}

function getItem(itemId) {
  return itemsDatabase[itemId] || null
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

/* ==========================================================================
   2. ROUTE & SEARCH STATE
   ========================================================================== */
const route = useRoute()
const code = ref(route.query.code || '')
const claim = ref(null)
const searched = ref(false)
const error = ref('')
const isLoading = ref(false)

const item = computed(() => {
  if (!claim.value) return null
  return getItem(claim.value.itemId) || {
    name: 'Item #' + (claim.value.itemId || 'Unknown'),
    category: 'General',
    location: 'Campus Desk'
  }
})

const steps = [
  { label: 'Submitted', desc: 'Claim received' },
  { label: 'Under Review', desc: 'Security verification' },
  { label: 'Approved', desc: 'Ready for collection' },
  { label: 'Returned', desc: 'Item handed over' }
]

const stepIndex = computed(() => {
  const s = claim.value?.status?.toLowerCase()
  if (s === 'pending') return 1
  if (s === 'approved') return 2
  if (s === 'returned') return 3
  if (s === 'rejected') return 1
  return 0
})

/* ==========================================================================
   3. LOOKUP FUNCTION
   ========================================================================== */
function lookup() {
  error.value = ''
  claim.value = null
  const query = code.value.trim().toUpperCase()

  if (!query) {
    error.value = 'Please enter your claim code.'
    return
  }

  isLoading.value = true
  searched.value = true

  setTimeout(() => {
    isLoading.value = false
    const found = getClaimByCode(query)

    if (found) {
      claim.value = found
    } else {
      error.value = `No claim found for "${query}". Please check the code and try again.`
    }
  }, 250)
}

function setDemo(demoCode) {
  code.value = demoCode
  lookup()
}

if (code.value) {
  lookup()
}
</script>

<template>
  <div class="page narrow track-page">

    <!-- HERO HEADER -->
    <div class="hero-section">
      <div class="badge-pill">OFFICIAL STUDENT VERIFICATION PORTAL</div>
      <h1 class="page-title">Track Your Claim</h1>
      <p class="muted">Enter the claim code you received after submitting your claim to check real-time status.</p>
    </div>

    <!-- SEARCH BAR CARD -->
    <div class="card search-card">
      <form class="search-bar" @submit.prevent="lookup">
        <div class="input-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="code" 
            type="text" 
            placeholder="e.g. CLM-2026-00125" 
            class="input-field"
            autocomplete="off"
          />
        </div>

        <button type="submit" class="btn primary" :disabled="isLoading">
          <span v-if="!isLoading">Track Claim</span>
          <span v-else class="btn-spinner">
            <span class="spinner-circle"></span>
            Searching...
          </span>
        </button>
      </form>

      <!-- Error / Validation Alert -->
      <div v-if="error" class="error-msg">
        <span class="err-icon">⚠️</span> {{ error }}
      </div>

      <!-- Quick Test Demo Chips -->
      <div class="quick-test-row">
        <span class="quick-label">Quick Test:</span>
        <button type="button" class="demo-chip pending" @click="setDemo('CLM-2026-00125')">
          <span class="dot"></span> Pending Demo
        </button>
        <button type="button" class="demo-chip approved" @click="setDemo('CLM-2026-00089')">
          <span class="dot"></span> Approved Demo
        </button>
        <button type="button" class="demo-chip rejected" @click="setDemo('CLM-2026-00042')">
          <span class="dot"></span> Rejected Demo
        </button>
      </div>
    </div>

    <!-- RESULTS & DETAILS AREA -->
    <div class="results-area">
      
      <!-- 1. CLAIM RESULT CARD (WHEN FOUND) -->
      <div v-if="claim" class="card claim-details-card">
        
        <!-- Header: Code and Status Badge -->
        <div class="claim-header">
          <div>
            <span class="meta-label">CLAIM REFERENCE</span>
            <h2 class="claim-code-text">{{ claim.code || code }}</h2>
          </div>
          <div :class="['status-badge', claim.status?.toLowerCase()]">
            <span class="status-dot"></span>
            {{ claim.status?.toUpperCase() }}
          </div>
        </div>

        <!-- Stepper Progress Timeline -->
        <div class="stepper-wrap">
          <div class="stepper-bar">
            <!-- Progress Fill Line -->
            <div 
              class="stepper-progress"
              :style="{ width: ((stepIndex / (steps.length - 1)) * 100) + '%' }"
            ></div>

            <!-- Step Nodes -->
            <div 
              v-for="(step, idx) in steps" 
              :key="step.label" 
              class="step-node"
              :class="{ 
                done: idx < stepIndex, 
                current: idx === stepIndex,
                rejected: claim.status?.toLowerCase() === 'rejected' && idx === stepIndex
              }"
            >
              <div class="step-circle">
                <span v-if="idx < stepIndex">✓</span>
                <span v-else-if="claim.status?.toLowerCase() === 'rejected' && idx === stepIndex">✕</span>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="step-title">{{ step.label }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 2x2 Details Grid -->
        <div class="details-grid">
          <div class="detail-box">
            <span class="detail-label">Item Name</span>
            <span class="detail-val bold">{{ item?.name || 'Unspecified Item' }}</span>
          </div>

          <div class="detail-box">
            <span class="detail-label">Category</span>
            <span class="detail-val">{{ item?.category || 'General' }}</span>
          </div>

          <div class="detail-box">
            <span class="detail-label">Date Submitted</span>
            <span class="detail-val">
              {{ formatDate(claim.createdAt) }}
            </span>
          </div>

          <div class="detail-box">
            <span class="detail-label">Found Location</span>
            <span class="detail-val">{{ item?.location || 'Campus Desk' }}</span>
          </div>
        </div>

        <!-- Status Notice Box -->
        <div :class="['notice-box', claim.status?.toLowerCase()]">
          <div class="notice-icon">
            <span v-if="claim.status?.toLowerCase() === 'pending'">⏳</span>
            <span v-else-if="claim.status?.toLowerCase() === 'approved'">🎉</span>
            <span v-else-if="claim.status?.toLowerCase() === 'returned'">✅</span>
            <span v-else>⚠️</span>
          </div>
          <div class="notice-body">
            <div class="notice-title">
              <span v-if="claim.status?.toLowerCase() === 'pending'">Verification In Progress</span>
              <span v-else-if="claim.status?.toLowerCase() === 'approved'">Claim Approved — Ready for Collection</span>
              <span v-else-if="claim.status?.toLowerCase() === 'returned'">Item Handed Over</span>
              <span v-else>Verification Unsuccessful</span>
            </div>
            <p class="notice-text">
              {{ claim.note || (
                claim.status?.toLowerCase() === 'pending'
                  ? 'Your claim has been recorded and is currently being verified by campus security. Please allow 24–48 hours.'
                  : (claim.status?.toLowerCase() === 'approved'
                    ? 'Your claim is verified! Please visit Room 104 with your Student ID card to collect your item.'
                    : (claim.status?.toLowerCase() === 'returned'
                      ? 'This case is resolved. The item was collected by the verified owner.'
                      : 'The proof submitted did not match the recovered property. Please contact the desk.'))
              ) }}
            </p>
          </div>
        </div>

      </div>

      <!-- 2. DEFAULT 3-STEP GUIDE CARD (BEFORE SEARCH) -->
      <div v-else-if="!searched" class="card guide-card">
        <div class="guide-header">
          <span class="guide-icon">📋</span>
          <div>
            <h3>How Claim Tracking Works</h3>
            <p class="muted">Simple steps to verify and claim your belongings</p>
          </div>
        </div>

        <div class="guide-steps">
          <div class="guide-step">
            <div class="step-num">1</div>
            <h4>Enter Claim Reference</h4>
            <p>Input the unique reference code provided on your claim voucher.</p>
          </div>
          <div class="guide-step">
            <div class="step-num">2</div>
            <h4>Physical Verification</h4>
            <p>Campus security cross-checks serials, physical traits, and ownership proof.</p>
          </div>
          <div class="guide-step">
            <div class="step-num">3</div>
            <h4>Collect in Person</h4>
            <p>Visit Room 104 with your Student ID card to collect your belonging.</p>
          </div>
        </div>

        <div class="guide-tip">
          💡 <strong>Tip:</strong> Click on any of the Quick Test buttons above for an instant demo!
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
/* ==========================================================================
   PALETTE: Sunset Clay & Midnight Indigo (Sunlit Sand Theme)
   Canvas: #FDF8F5 | Surface: #FFFFFF / #F5ECE6
   Primary Text: #1A1F36 | Secondary Text: #5A627A
   Primary Accent: #D14928 (Burnt Terracotta)
   Secondary Accent: #2B59C3 (Royal Cobalt)
   Fonts: Inter (English), Nikosh (Bangla)
   ========================================================================== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.maateen.me/nikosh/font.css');

.track-page {
  font-family: 'Inter', 'Nikosh', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1A1F36;
  max-width: 820px;
  margin: 0 auto;
  padding: 36px 20px 60px;
  box-sizing: border-box;
}

/* Hero Header */
.hero-section {
  text-align: center;
  margin-bottom: 26px;
}

.badge-pill {
  display: inline-block;
  background-color: #F5ECE6;
  color: #D14928;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 5px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(209, 73, 40, 0.2);
  margin-bottom: 12px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1A1F36;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.muted {
  font-size: 0.95rem;
  color: #5A627A;
  margin: 0 auto;
  max-width: 540px;
  line-height: 1.5;
}

/* Card Base */
.card {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #EAE0D8;
  box-shadow: 0 6px 20px rgba(26, 31, 54, 0.04);
}

/* Search Card */
.search-card {
  padding: 22px;
  margin-bottom: 26px;
}

.search-bar {
  display: flex;
  gap: 12px;
}

.input-wrap {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: #5A627A;
  pointer-events: none;
}

.input-field {
  width: 100%;
  padding: 13px 16px 13px 44px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1A1F36;
  background-color: #FDF8F5;
  border: 1.5px solid #EAE0D8;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #2B59C3;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(43, 89, 195, 0.12);
}

.btn.primary {
  padding: 0 24px;
  background-color: #2B59C3;
  color: #FFFFFF;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn.primary:hover:not(:disabled) {
  background-color: #1e449c;
}

.btn.primary:disabled {
  opacity: 0.75;
  cursor: wait;
}

.btn-spinner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner-circle {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error message */
.error-msg {
  margin-top: 12px;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Quick test pills */
.quick-test-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #F5ECE6;
}

.quick-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #5A627A;
}

.demo-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FDF8F5;
  border: 1px solid #EAE0D8;
  color: #1A1F36;
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}

.demo-chip:hover {
  border-color: #D14928;
  background: #F5ECE6;
}

.demo-chip .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.demo-chip.pending .dot { background-color: #D14928; }
.demo-chip.approved .dot { background-color: #2B59C3; }
.demo-chip.rejected .dot { background-color: #DC2626; }

/* Claim Details Card */
.claim-details-card {
  padding: 28px;
}

.claim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #F5ECE6;
}

.meta-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #5A627A;
  display: block;
}

.claim-code-text {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1A1F36;
  margin: 2px 0 0;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: currentColor;
}

.status-badge.pending { background-color: #FFF4EC; color: #D14928; border: 1px solid #FCD8C7; }
.status-badge.approved { background-color: #EEF4FF; color: #2B59C3; border: 1px solid #C8DCFF; }
.status-badge.returned { background-color: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.status-badge.rejected { background-color: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }

/* Stepper */
.stepper-wrap {
  padding: 32px 10px 26px;
}

.stepper-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.stepper-bar::before {
  content: '';
  position: absolute;
  top: 17px;
  left: 25px;
  right: 25px;
  height: 3px;
  background-color: #F0E6DE;
  z-index: 1;
}

.stepper-progress {
  position: absolute;
  top: 17px;
  left: 25px;
  height: 3px;
  background-color: #2B59C3;
  z-index: 2;
  transition: width 0.35s ease;
}

.step-node {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 85px;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 2px solid #D5C9BE;
  color: #5A627A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.step-node.done .step-circle {
  background-color: #2B59C3;
  border-color: #2B59C3;
  color: #FFFFFF;
}

.step-node.current .step-circle {
  background-color: #FFF4EC;
  border-color: #D14928;
  color: #D14928;
  box-shadow: 0 0 0 3px rgba(209, 73, 40, 0.15);
}

.step-node.rejected .step-circle {
  background-color: #FEF2F2;
  border-color: #DC2626;
  color: #DC2626;
}

.step-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1A1F36;
}

.step-desc {
  font-size: 0.68rem;
  color: #5A627A;
  margin-top: 2px;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 6px;
}

.detail-box {
  background: #FDF8F5;
  border: 1px solid #F0E6DE;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #5A627A;
  margin-bottom: 4px;
}

.detail-val {
  font-size: 0.92rem;
  color: #1A1F36;
}

.detail-val.bold {
  font-weight: 700;
  color: #2B59C3;
}

/* Notice Box */
.notice-box {
  margin-top: 18px;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notice-box.pending { background-color: #FFF4EC; border: 1px solid #FCD8C7; }
.notice-box.approved { background-color: #EEF4FF; border: 1px solid #C8DCFF; }
.notice-box.returned { background-color: #ECFDF5; border: 1px solid #A7F3D0; }
.notice-box.rejected { background-color: #FEF2F2; border: 1px solid #FECACA; }

.notice-icon { font-size: 1.3rem; line-height: 1; }
.notice-title { font-size: 0.88rem; font-weight: 700; color: #1A1F36; margin-bottom: 2px; }
.notice-text { margin: 0; font-size: 0.82rem; color: #5A627A; line-height: 1.5; }

/* Guide Card */
.guide-card {
  padding: 26px;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F5ECE6;
}

.guide-icon {
  font-size: 1.6rem;
  background: #FDF8F5;
  padding: 8px;
  border-radius: 10px;
}

.guide-header h3 { margin: 0 0 2px; font-size: 1.1rem; font-weight: 700; }
.guide-header p { margin: 0; font-size: 0.85rem; }

.guide-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 20px 0;
}

.guide-step {
  background: #FDF8F5;
  border: 1px solid #F0E6DE;
  padding: 14px;
  border-radius: 10px;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2B59C3;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.guide-step h4 { margin: 0 0 4px; font-size: 0.88rem; font-weight: 700; }
.guide-step p { margin: 0; font-size: 0.78rem; color: #5A627A; line-height: 1.45; }

.guide-tip {
  background: #FDF8F5;
  border: 1px dashed #EAE0D8;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #5A627A;
  text-align: center;
}

/* Responsive */
@media (max-width: 650px) {
  .search-bar { flex-direction: column; }
  .btn.primary { padding: 12px; }
  .details-grid { grid-template-columns: 1fr; }
  .guide-steps { grid-template-columns: 1fr; }
  .step-desc { display: none; }
  .step-node { width: 65px; }
}
</style>
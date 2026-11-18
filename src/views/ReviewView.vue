<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getClaims, getAllItemsAdmin, updateClaim, setItemStatus, formatDate } from '../data/store'
import { getAuthToken, removeAuthToken } from '../api/index'

const router = useRouter()
const mainSection = ref('claims') // 'claims' | 'items'
const tab = ref('pending')
const claims = ref([])
const items = ref([])
const loading = ref(true)
const error = ref('')

// Claims tabs: pending → approve/reject, approved → mark returned, rejected, returned (read-only)
const tabs = ['pending', 'approved', 'rejected', 'returned']

const shown = computed(() =>
  claims.value.filter((c) => (c.status || '').toLowerCase() === tab.value)
)
const count = (s) => claims.value.filter((c) => (c.status || '').toLowerCase() === s).length

// Items: active = not returned, returned = done
const activeItems = computed(() => items.value.filter((i) => (i.status || '') !== 'returned'))
const returnedItems = computed(() => items.value.filter((i) => (i.status || '') === 'returned'))
const itemsTab = ref('active') // 'active' | 'returned'

async function loadData() {
  const token = getAuthToken()
  if (!token) {
    error.value = 'Please log in as Admin to access this dashboard.'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    const [claimsRes, itemsRes] = await Promise.all([getClaims(), getAllItemsAdmin()])
    claims.value = claimsRes || []
    items.value = itemsRes || []
  } catch (err) {
    error.value = err.message || 'Failed to fetch data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

async function changeClaimStatus(c, status) {
  try {
    await updateClaim(c.id, status)
    await loadData()
    // Auto-switch to next logical tab
    if (status === 'approved') tab.value = 'approved'
    if (status === 'rejected') tab.value = 'rejected'
    if (status === 'returned') tab.value = 'returned'
  } catch (err) {
    alert(err.message || 'Action failed')
  }
}

async function changeItemStatus(itemId, newStatus) {
  try {
    await setItemStatus(itemId, newStatus)
    await loadData()
  } catch (err) {
    alert(err.message || 'Failed to update item status')
  }
}

function logout() {
  removeAuthToken()
  router.push('/login')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>{{ $t('admin.title') }}</h1>
        <p class="muted">{{ $t('admin.subtitle') }}</p>
      </div>
      <button v-if="getAuthToken()" class="btn btn-outline logout-btn" @click="logout">
        {{ $t('nav.logout') }}
      </button>
    </div>

    <!-- Auth error -->
    <div v-if="error" class="card empty" style="border: 1px solid #f87171;">
      <h2>Authentication Required</h2>
      <p class="muted">{{ error }}</p>
      <RouterLink to="/login" class="btn btn-primary" style="margin-top: 12px; display: inline-block;">
        {{ $t('nav.login') }}
      </RouterLink>
    </div>

    <div v-else-if="loading" class="card empty">
      <p class="muted">{{ $t('common.loading') }}</p>
    </div>

    <template v-else>
      <!-- Section Switcher -->
      <div class="section-switcher">
        <button
          type="button" class="btn"
          :class="mainSection === 'claims' ? 'btn-primary' : 'btn-outline'"
          @click="mainSection = 'claims'"
        >
          {{ $t('admin.claimsTab') }}
          <span class="pill">{{ claims.length }}</span>
        </button>
        <button
          type="button" class="btn"
          :class="mainSection === 'items' ? 'btn-primary' : 'btn-outline'"
          @click="mainSection = 'items'"
        >
          {{ $t('admin.itemsTab') }}
          <span class="pill">{{ activeItems.length }}</span>
        </button>
      </div>

      <!-- ======== CLAIMS SECTION ======== -->
      <div v-if="mainSection === 'claims'">
        <div class="tabs">
          <button
            v-for="t in tabs" :key="t"
            type="button"
            :class="['tab-btn', { active: tab === t }]"
            @click="tab = t"
          >
            <span class="tab-label">
              {{ t === 'pending' ? $t('admin.pendingTab')
                : t === 'approved' ? $t('admin.approvedTab')
                : t === 'rejected' ? $t('admin.rejectedTab')
                : $t('admin.returnedTab') }}
            </span>
            <span class="count-badge" :class="t">{{ count(t) }}</span>
          </button>
        </div>

        <!-- Instruction strip -->
        <p v-if="tab === 'pending'" class="strip info">
          📋 Review each claim and <strong>Approve</strong> or <strong>Reject</strong> it.
        </p>
        <p v-else-if="tab === 'approved'" class="strip success">
          ✅ These claims are approved. When the student collects the item, click <strong>Mark as Returned</strong>.
        </p>
        <p v-else-if="tab === 'rejected'" class="strip danger">
          ❌ These claims were rejected.
        </p>
        <p v-else-if="tab === 'returned'" class="strip muted-strip">
          📦 These claims are fully resolved — item handed over.
        </p>

        <div v-if="shown.length" class="claim-list">
          <article v-for="c in shown" :key="c.code" class="card claim-row">
            <div class="claim-row__main">
              <div class="claim-code-chip">{{ c.code }}</div>
              <h3>{{ c.item?.name || c.item?.itemName || 'Item #' + (c.itemId || '') }}</h3>
              <p class="muted small">
                👤 {{ c.name }} &nbsp;·&nbsp;
                🪪 {{ c.studentId }} &nbsp;·&nbsp;
                📧 {{ c.email }} &nbsp;·&nbsp;
                📅 {{ formatDate(c.createdAt) }}
              </p>
              <p class="proof">
                📍 <strong>Location:</strong>
                {{ c.item?.location || c.item?.campusLocation || 'Campus' }}
              </p>
            </div>

            <div class="claim-row__actions">
              <!-- PENDING → Approve / Reject -->
              <template v-if="tab === 'pending'">
                <button type="button" class="btn btn-approve" @click="changeClaimStatus(c, 'approved')">
                  ✓ {{ $t('admin.approve') }}
                </button>
                <button type="button" class="btn btn-reject" @click="changeClaimStatus(c, 'rejected')">
                  ✕ {{ $t('admin.reject') }}
                </button>
              </template>

              <!-- APPROVED → Mark as Returned -->
              <template v-else-if="tab === 'approved'">
                <button type="button" class="btn btn-returned" @click="changeClaimStatus(c, 'returned')">
                  📦 {{ $t('admin.markReturned') }}
                </button>
              </template>

              <!-- RETURNED / REJECTED → read-only badge -->
              <span v-else class="status-chip" :class="tab">
                {{ tab === 'returned' ? '✅ Returned' : '❌ Rejected' }}
              </span>
            </div>
          </article>
        </div>

        <div v-else class="card empty">
          <h2>{{ $t('admin.nothingHere') }}</h2>
          <p class="muted">{{ $t('admin.noClaimsRightNow', { tab }) }}</p>
        </div>
      </div>

      <!-- ======== ITEMS SECTION ======== -->
      <div v-else-if="mainSection === 'items'">
        <!-- Active / Returned sub-tabs -->
        <div class="tabs">
          <button type="button" :class="['tab-btn', { active: itemsTab === 'active' }]" @click="itemsTab = 'active'">
            <span class="tab-label">Active Items</span>
            <span class="count-badge pending">{{ activeItems.length }}</span>
          </button>
          <button type="button" :class="['tab-btn', { active: itemsTab === 'returned' }]" @click="itemsTab = 'returned'">
            <span class="tab-label">Returned / Closed</span>
            <span class="count-badge returned">{{ returnedItems.length }}</span>
          </button>
        </div>

        <!-- ACTIVE items list -->
        <template v-if="itemsTab === 'active'">
          <div v-if="activeItems.length" class="claim-list">
            <article v-for="it in activeItems" :key="it.id" class="card claim-row">
              <div class="claim-row__main">
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                  <span class="badge" :class="it.type">
                    {{ it.type === 'lost' ? $t('common.lost') : $t('common.found') }}
                  </span>
                  <span class="badge" style="background:#e0f2fe; color:#0369a1;">{{ it.status }}</span>
                </div>
                <h3>{{ it.name }}</h3>
                <p class="muted small">
                  📍 {{ it.location }} · 📅 {{ formatDate(it.date) }} ·
                  {{ $t('admin.reportedBy') }}: {{ it.reporterName }} ({{ it.reporterEmail }})
                </p>
                <p v-if="it.description" class="muted small">{{ it.description }}</p>
              </div>
              <div class="claim-row__actions">
                <button type="button" class="btn btn-returned" @click="changeItemStatus(it.id, 'RETURNED')">
                  📦 {{ $t('admin.markReturned') }}
                </button>
              </div>
            </article>
          </div>
          <div v-else class="card empty">
            <h2>No active items</h2>
            <p class="muted">All items have been resolved.</p>
          </div>
        </template>

        <!-- RETURNED items list (read-only) -->
        <template v-else>
          <div v-if="returnedItems.length" class="claim-list">
            <article v-for="it in returnedItems" :key="it.id" class="card claim-row returned-row">
              <div class="claim-row__main">
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                  <span class="badge" :class="it.type">
                    {{ it.type === 'lost' ? $t('common.lost') : $t('common.found') }}
                  </span>
                  <span class="badge" style="background:#d1fae5; color:#065f46;">✅ returned</span>
                </div>
                <h3>{{ it.name }}</h3>
                <p class="muted small">
                  📍 {{ it.location }} · 📅 {{ formatDate(it.date) }} ·
                  {{ $t('admin.reportedBy') }}: {{ it.reporterName }} ({{ it.reporterEmail }})
                </p>
                <p v-if="it.description" class="muted small">{{ it.description }}</p>
              </div>
              <div class="claim-row__actions">
                <button type="button" class="btn btn-outline reopen-btn" @click="changeItemStatus(it.id, 'OPEN')">
                  ↩ {{ $t('admin.reopenOpen') }}
                </button>
              </div>
            </article>
          </div>
          <div v-else class="card empty">
            <h2>No returned items yet</h2>
            <p class="muted">Items marked as returned will appear here.</p>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
}

.logout-btn { padding: 7px 16px; }

.section-switcher {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.section-switcher .pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.3);
  border-radius: 9999px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.72rem;
  font-weight: 700;
  margin-left: 6px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #E2E8F0;
  margin-bottom: 20px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  color: #5A627A;
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 6px 6px 0 0;
}

.tab-btn:hover { background: #F8FAFC; color: #1A1F36; }

.tab-btn.active {
  color: #2B59C3;
  border-bottom-color: #2B59C3;
  background: #EEF4FF;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.count-badge.pending  { background: #FFF4EC; color: #D14928; }
.count-badge.approved { background: #EEF4FF; color: #2B59C3; }
.count-badge.rejected { background: #FEF2F2; color: #DC2626; }
.count-badge.returned { background: #ECFDF5; color: #059669; }

/* Info strips */
.strip {
  margin: 0 0 16px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.84rem;
}

.strip.info    { background: #EEF4FF; color: #1e3a8a; border: 1px solid #BFDBFE; }
.strip.success { background: #ECFDF5; color: #065f46; border: 1px solid #A7F3D0; }
.strip.danger  { background: #FEF2F2; color: #991b1b; border: 1px solid #FECACA; }
.strip.muted-strip { background: #F8FAFC; color: #475569; border: 1px solid #E2E8F0; }

/* Claim row */
.claim-list { display: flex; flex-direction: column; gap: 12px; }

.claim-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
  flex-wrap: wrap;
}

.returned-row { opacity: 0.82; }

.claim-row__main { flex: 1; min-width: 0; }
.claim-row__actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; flex-shrink: 0; }

.claim-code-chip {
  display: inline-block;
  font-family: monospace;
  font-size: 0.78rem;
  font-weight: 700;
  background: #EEF4FF;
  color: #2B59C3;
  padding: 3px 10px;
  border-radius: 6px;
  margin-bottom: 6px;
}

h3 { margin: 0 0 4px; font-size: 1rem; font-weight: 700; color: #1A1F36; }

.small { font-size: 0.8rem; }

.proof { margin: 6px 0 0; font-size: 0.82rem; color: #334155; }

/* Action buttons */
.btn-approve {
  background: #2B59C3;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-approve:hover { background: #1e449c; }

.btn-reject {
  background: #FEF2F2;
  color: #DC2626;
  border: 1.5px solid #FECACA;
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-reject:hover { background: #DC2626; color: #fff; border-color: #DC2626; }

.btn-returned {
  background: #ECFDF5;
  color: #059669;
  border: 1.5px solid #A7F3D0;
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-returned:hover { background: #059669; color: #fff; border-color: #059669; }

.reopen-btn {
  font-size: 0.82rem;
  padding: 7px 14px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status-chip.returned { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.status-chip.rejected { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }

/* Badges */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge.lost  { background: #FFF4EC; color: #D14928; }
.badge.found { background: #EEF4FF; color: #2B59C3; }

/* Empty */
.empty {
  text-align: center;
  padding: 40px 20px;
}
</style>

// ---------------------------------------------------------------
// TEMPORARY DATA LAYER (mock data + localStorage).
// Backend team (persons 6-9) will replace these functions with real
// fetch() calls to the API. Keep the function names so the views
// don't need to change.
// ---------------------------------------------------------------

const SEED_ITEMS = [
  { id: 1, type: 'found', name: 'Black Leather Wallet', category: 'Wallet', description: 'Black leather wallet with a few cards inside. Found near the library entrance.', date: '2026-11-12', location: 'Central Library', status: 'open' },
  { id: 2, type: 'lost', name: 'Blue Water Bottle', category: 'Other', description: 'Blue steel water bottle with a small dent near the bottom and a sticker on the side.', date: '2026-11-10', location: 'Cafeteria', status: 'open' },
  { id: 3, type: 'found', name: 'Silver Wrist Watch', category: 'Accessories', description: 'Silver analog watch with a brown strap. Found in the Block B washroom.', date: '2026-11-09', location: 'Academic Block B', status: 'open' },
  { id: 4, type: 'lost', name: 'Student ID Card', category: 'ID / Cards', description: 'University student ID card. Lost somewhere between the main gate and the auditorium.', date: '2026-11-08', location: 'Main Gate', status: 'open' },
  { id: 5, type: 'found', name: 'Wireless Earbuds', category: 'Electronics', description: 'White wireless earbuds in a charging case. Found on a bench in the playground area.', date: '2026-11-07', location: 'Playground', status: 'open' },
  { id: 6, type: 'found', name: 'Red Backpack', category: 'Bags', description: 'Red backpack with notebooks and a calculator inside. Left in classroom 304.', date: '2026-11-05', location: 'Academic Block A', status: 'returned' },
  { id: 7, type: 'lost', name: 'Scientific Calculator', category: 'Electronics', description: 'Casio scientific calculator with my initials scratched on the back.', date: '2026-11-04', location: 'Engineering Lab', status: 'open' },
  { id: 8, type: 'found', name: 'House Keys', category: 'Keys', description: 'Set of three keys on a green keychain.', date: '2026-11-03', location: 'Parking Area', status: 'open' },
]

export const CATEGORIES = ['Wallet', 'Electronics', 'Bags', 'Keys', 'ID / Cards', 'Accessories', 'Books', 'Clothing', 'Other']
export const LOCATIONS = ['Central Library', 'Cafeteria', 'Academic Block A', 'Academic Block B', 'Engineering Lab', 'Main Gate', 'Parking Area', 'Playground', 'Auditorium', 'Hostel', 'Other']

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

// ---------- ITEMS ----------
export function getItems() {
  const extra = load('lf_items_extra', [])
  const overrides = load('lf_item_status', {})
  return [...extra, ...SEED_ITEMS]
    .map((i) => ({ ...i, status: overrides[i.id] || i.status }))
}

export function getItem(id) {
  return getItems().find((i) => String(i.id) === String(id)) || null
}

export function addItem(data) {
  const extra = load('lf_items_extra', [])
  const item = { ...data, id: Date.now(), status: 'open' }
  save('lf_items_extra', [item, ...extra])
  return item
}

export function setItemStatus(id, status) {
  const overrides = load('lf_item_status', {})
  overrides[id] = status
  save('lf_item_status', overrides)
}

// ---------- CLAIMS ----------
// status: pending | approved | rejected | returned
function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return 'LF-' + out
}

export function getClaims() {
  return load('lf_claims', [])
}

export function submitClaim({ itemId, name, studentId, email, proof }) {
  const claims = getClaims()
  let code = makeCode()
  while (claims.some((c) => c.code === code)) code = makeCode()
  const claim = {
    code, itemId, name, studentId, email, proof,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  save('lf_claims', [claim, ...claims])
  return claim // backend will return the generated code the same way
}

export function getClaimByCode(code) {
  const c = (code || '').trim().toUpperCase()
  return getClaims().find((x) => x.code === c) || null
}

export function updateClaim(code, status) {
  const claims = getClaims().map((c) => (c.code === code ? { ...c, status } : c))
  save('lf_claims', claims)
  const claim = claims.find((c) => c.code === code)
  if (claim && status === 'returned') setItemStatus(claim.itemId, 'returned')
  if (claim && status === 'approved') setItemStatus(claim.itemId, 'claimed')
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

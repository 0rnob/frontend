import {
  fetchAllItems,
  fetchItemById,
  createItem as createItemApi,
  patchItemStatus,
  submitClaimApi,
  fetchAllClaims,
  fetchClaimByCode as fetchClaimByCodeApi,
  approveClaimApi,
  rejectClaimApi,
  returnClaimApi,
} from '../api/index'

export const CATEGORIES = [
  'Wallet',
  'Electronics',
  'Bags',
  'Keys',
  'ID / Cards',
  'Accessories',
  'Books',
  'Clothing',
  'Other',
]

export const LOCATIONS = [
  'Central Library',
  'Cafeteria',
  'Academic Block A',
  'Academic Block B',
  'Engineering Lab',
  'Main Gate',
  'Parking Area',
  'Playground',
  'Auditorium',
  'Hostel',
  'Other',
]

export function transformItemFromBackend(i) {
  if (!i) return null
  return {
    id: i.id,
    name: i.itemName || i.name || 'Unnamed Item',
    type: (i.itemType || i.type || 'lost').toLowerCase(),
    category: i.category || 'Other',
    description: i.description || '',
    date: i.reportDate || i.date || '',
    location: i.campusLocation || i.location || '',
    reporterName: i.reporterName || '',
    reporterEmail: i.reporterEmail || '',
    status: (i.status || 'open').toLowerCase(),
    createdAt: i.createdAt,
  }
}

export function transformItemToBackend(data) {
  return {
    itemName: data.name || data.itemName,
    description: data.description || '',
    itemType: (data.type || data.itemType || 'LOST').toUpperCase(),
    reportDate: data.date || data.reportDate || new Date().toISOString().slice(0, 10),
    campusLocation: data.location || data.campusLocation || 'Main Campus',
    reporterName: data.reporterName || 'Anonymous',
    reporterEmail: data.reporterEmail || 'student@example.com',
    status: (data.status || 'OPEN').toUpperCase(),
  }
}

export function transformClaimFromBackend(c) {
  if (!c) return null
  return {
    id: c.id,
    code: c.claimCode || c.code,
    itemId: c.item?.id || c.itemId,
    name: c.claimantName || c.name || '',
    studentId: c.studentId || '',
    email: c.claimantEmail || c.email || '',
    proof: c.proof || (c.item ? `Claim for ${c.item.itemName || 'item'}` : 'Submitted claim'),
    status: (c.status || 'pending').toLowerCase(),
    createdAt: c.createdAt || new Date().toISOString(),
    reviewedAt: c.reviewedAt,
    item: c.item ? transformItemFromBackend(c.item) : null,
  }
}

// ---------- ITEMS ----------
// getItems → public pages: returned items hidden
export async function getItems() {
  try {
    const list = await fetchAllItems()
    if (Array.isArray(list)) {
      return list
        .map(transformItemFromBackend)
        .filter((i) => (i.status || '').toLowerCase() !== 'returned')
    }
    return []
  } catch (err) {
    console.error('Failed to fetch items from backend:', err)
    return []
  }
}

// getAllItemsAdmin → admin dashboard: all items including returned
export async function getAllItemsAdmin() {
  try {
    const list = await fetchAllItems()
    if (Array.isArray(list)) {
      return list.map(transformItemFromBackend)
    }
    return []
  } catch (err) {
    console.error('Failed to fetch items from backend:', err)
    return []
  }
}

export async function getItem(id) {
  try {
    const data = await fetchItemById(id)
    return transformItemFromBackend(data)
  } catch (err) {
    console.error(`Failed to fetch item ${id} from backend:`, err)
    return null
  }
}

export async function addItem(data) {
  const payload = transformItemToBackend(data)
  const created = await createItemApi(payload)
  return transformItemFromBackend(created)
}

export async function setItemStatus(id, status) {
  const updated = await patchItemStatus(id, (status || 'OPEN').toUpperCase())
  return transformItemFromBackend(updated)
}

// ---------- CLAIMS ----------
function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return 'LF-' + out
}

export async function getClaims() {
  try {
    const list = await fetchAllClaims()
    if (Array.isArray(list)) {
      return list.map(transformClaimFromBackend)
    }
    return []
  } catch (err) {
    console.error('Failed to fetch claims from backend:', err)
    return []
  }
}

export async function submitClaim({ itemId, name, studentId, email, proof }) {
  const payload = {
    claimantName: name,
    claimantEmail: email,
    studentId: studentId,
    claimCode: makeCode(),
    status: 'PENDING',
    item: { id: Number(itemId) },
  }
  const created = await submitClaimApi(payload)
  const result = transformClaimFromBackend(created)
  if (proof) {
    result.proof = proof
  }
  return result
}

export async function getClaimByCode(code) {
  try {
    const data = await fetchClaimByCodeApi(code)
    return transformClaimFromBackend(data)
  } catch (err) {
    console.error('Failed to fetch claim by code:', err)
    return null
  }
}

export async function updateClaim(claimId, status) {
  const s = (status || '').toLowerCase()
  if (s === 'approved') {
    return approveClaimApi(claimId)
  } else if (s === 'rejected') {
    return rejectClaimApi(claimId)
  } else if (s === 'returned') {
    return returnClaimApi(claimId)
  }
  return null
}

export function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

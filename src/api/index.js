import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

// Reactive auth token ref for instantaneous UI updates across the entire app
export const authToken = ref(localStorage.getItem('token') || '')

export function getAuthToken() {
  return authToken.value
}

export function setAuthToken(token) {
  authToken.value = token || ''
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export function removeAuthToken() {
  authToken.value = ''
  localStorage.removeItem('token')
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getAuthToken()
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`
    let errorData = null
    try {
      errorData = await res.json()
      errorMsg = errorData.message || errorData.error || JSON.stringify(errorData)
    } catch {
      try {
        const text = await res.text()
        if (text) errorMsg = text
      } catch { /* ignore */ }
    }
    const err = new Error(errorMsg)
    err.status = res.status
    err.data = errorData
    throw err
  }

  // Handle empty responses
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

// Items API
export async function fetchAllItems() {
  return request('/items', { method: 'GET' })
}

export async function fetchItemById(id) {
  return request(`/items/${id}`, { method: 'GET' })
}

export async function createItem(item) {
  return request('/items', {
    method: 'POST',
    body: JSON.stringify(item),
  })
}

export async function patchItemStatus(id, status) {
  return request(`/items/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Claims API
export async function submitClaimApi(claim) {
  return request('/claims', {
    method: 'POST',
    body: JSON.stringify(claim),
  })
}

export async function fetchAllClaims() {
  return request('/claims', { method: 'GET' })
}

export async function fetchClaimByCode(code) {
  return request(`/claims/track/${encodeURIComponent(code)}`, { method: 'GET' })
}

export async function approveClaimApi(id) {
  return request(`/claims/${id}/approve`, { method: 'PATCH' })
}

export async function rejectClaimApi(id) {
  return request(`/claims/${id}/reject`, { method: 'PATCH' })
}

export async function returnClaimApi(id) {
  return request(`/claims/${id}/return`, { method: 'PATCH' })
}

// Auth API
export async function loginApi(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  if (data && data.token) {
    setAuthToken(data.token)
  }
  return data
}

export async function registerApi(username, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

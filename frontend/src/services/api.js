const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('sakaymoto_token')
  const headers = new Headers(options.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!(options.body instanceof FormData) && options.body !== undefined)
    headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) throw new Error(payload?.message || 'Something went wrong. Please try again.')
  return payload
} 

export const api = {
  login: (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  profile: () => apiRequest('/users/me'),
  updateProfile: (body) => apiRequest('/users/me', { method: 'PATCH', body }),
  motorcycles: (status = 'available') =>
    apiRequest(`/motorcycles?status=${encodeURIComponent(status)}`),
  motorcycle: (id) => apiRequest(`/motorcycles/${id}`),
  bookings: () => apiRequest('/bookings'),
  booking: (body) => apiRequest('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  updateBookingStatus: (id, status) =>
    apiRequest(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  documents: (userId = null) =>
    apiRequest(userId ? `/documents?user_id=${encodeURIComponent(userId)}` : '/documents'),
  updateDocumentStatus: (id, status) =>
    apiRequest(`/documents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  uploadDocument: (formData) => apiRequest('/documents', { method: 'POST', body: formData }),
  payments: () => apiRequest('/payments'),
  payment: (body) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(body) }),
  users: () => apiRequest('/users'),
  motorcyclesAdmin: () => apiRequest('/motorcycles?status=all'),
  createMotorcycle: (body) =>
    apiRequest('/motorcycles', { method: 'POST', body: JSON.stringify(body) }),
  uploadMotorcycleImage: (id, formData) =>
    apiRequest(`/motorcycles/${id}/images`, { method: 'POST', body: formData }),
  updateMotorcycle: (id, body) =>
    apiRequest(`/motorcycles/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMotorcycle: (id) => apiRequest(`/motorcycles/${id}`, { method: 'DELETE' }),
  reports: () => apiRequest('/reports/summary'),
  rentals: () => apiRequest('/rentals'),
}

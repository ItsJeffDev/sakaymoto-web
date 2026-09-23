import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../services/api'

function normalizeUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') return null

  return {
    id: rawUser.id ?? null,
    name: rawUser.name ?? '',
    email: rawUser.email ?? '',
    role: rawUser.role ?? 'customer',
    phone: rawUser.phone ?? null,
    address: rawUser.address ?? null,
    profile_image: rawUser.profile_image ?? null,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('sakaymoto_token'))
  const user = ref(normalizeUser(JSON.parse(localStorage.getItem('sakaymoto_user') || 'null')))
  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setUser(rawUser) {
    user.value = normalizeUser(rawUser)
    if (user.value) {
      localStorage.setItem('sakaymoto_user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('sakaymoto_user')
    }
    return user.value
  }

  function setSession(payload) {
    const nextToken = payload?.token || token.value || null
    const nextUser = normalizeUser(payload?.user ?? payload?.data ?? payload)

    token.value = nextToken
    user.value = nextUser

    if (nextToken) {
      localStorage.setItem('sakaymoto_token', nextToken)
    } else {
      localStorage.removeItem('sakaymoto_token')
    }

    if (nextUser) {
      localStorage.setItem('sakaymoto_user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('sakaymoto_user')
    }

    return nextUser
  }

  async function login(credentials) {
    const payload = await api.login(credentials)
    const nextUser = setSession(payload)
    return nextUser
  }

  async function register(details) {
    return api.register(details)
  }

  async function hydrate() {
    if (!token.value) return null
    try {
      const payload = await api.profile()
      const nextUser = setUser(payload.user ?? payload.data ?? payload)
      return nextUser
    } catch {
      logout()
      return null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('sakaymoto_token')
    localStorage.removeItem('sakaymoto_user')
  }

  return { token, user, isAuthenticated, isAdmin, setUser, setSession, login, register, hydrate, logout }
})

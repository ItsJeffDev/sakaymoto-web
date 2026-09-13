import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('sakaymoto_token'))
  const user = ref(JSON.parse(localStorage.getItem('sakaymoto_user') || 'null'))
  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setSession(payload) {
    token.value = payload.token
    user.value = payload.user
    localStorage.setItem('sakaymoto_token', payload.token)
    localStorage.setItem('sakaymoto_user', JSON.stringify(payload.user))
  }

  async function login(credentials) {
    const payload = await api.login(credentials)
    setSession(payload)
    return payload.user
  }

  async function register(details) {
    return api.register(details)
  }

  async function hydrate() {
    if (!token.value) return null
    try {
      const payload = await api.profile()
      user.value = payload.data
      localStorage.setItem('sakaymoto_user', JSON.stringify(payload.data))
      return payload.data
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

  return { token, user, isAuthenticated, isAdmin, login, register, hydrate, logout }
})

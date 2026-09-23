<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminDashboard from './AdminDashboard.vue'
import CustomerDashboard from './CustomerDashboard.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const isHydrated = ref(false)

const requestedUserId = computed(() => Number(route.params.userId))
const isAuthorized = computed(
  () => !!auth.user && Number(auth.user.id) === requestedUserId.value,
)
const isAdmin = computed(() => auth.user?.role === 'admin')

onMounted(async () => {
  try {
    await auth.hydrate()
  } catch {
    // ignore and let route guards handle the redirect
  } finally {
    isHydrated.value = true

    if (auth.user && Number(auth.user.id) !== requestedUserId.value) {
      await router.replace(`/dashboard/${auth.user.id}`)
    }
  }
})
</script>

<template>
  <div v-if="!isHydrated" class="dashboard-redirect">Loading your dashboard...</div>
  <AdminDashboard v-else-if="isAuthorized && isAdmin" />
  <CustomerDashboard v-else-if="isAuthorized && !isAdmin" />
  <div v-else class="dashboard-redirect">Redirecting to your dashboard...</div>
</template>

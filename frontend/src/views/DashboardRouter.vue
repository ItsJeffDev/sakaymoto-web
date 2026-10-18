<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminDashboard from './AdminDashboard.vue'
import CustomerDashboard from './CustomerDashboard.vue'

const auth = useAuthStore()
const route = useRoute()

const requestedUserId = computed(() => Number(route.params.userId))
const isAuthorized = computed(
  () => !!auth.user && Number(auth.user.id) === requestedUserId.value,
)
const isAdmin = computed(() => auth.user?.role === 'admin')
</script>

<template>
  <AdminDashboard v-if="isAuthorized && isAdmin" />
  <CustomerDashboard v-else-if="isAuthorized && !isAdmin" />
  <div v-else class="dashboard-redirect">Redirecting to your dashboard...</div>
</template>

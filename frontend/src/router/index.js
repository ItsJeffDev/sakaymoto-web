import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/dashboard/customer', component: () => import('../views/CustomerDashboard.vue') },
    { path: '/dashboard/admin', component: () => import('../views/AdminDashboard.vue') },
  ],
})

export default router

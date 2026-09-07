import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/dashboard/customer', component: () => import('../views/CustomerDashboard.vue'), meta: { role: 'customer' } },
    { path: '/dashboard/admin', component: () => import('../views/AdminDashboard.vue'), meta: { role: 'admin' } },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.role && !auth.isAuthenticated) return '/'
  if (to.meta.role && auth.user?.role !== to.meta.role) return auth.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'
})

export default router

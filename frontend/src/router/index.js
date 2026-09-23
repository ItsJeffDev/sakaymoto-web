import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard/customer',
      component: () => import('../views/CustomerDashboard.vue'),
      meta: { role: 'customer' },
    },
    {
      path: '/dashboard/userid=:userId',
      component: () => import('../views/CustomerDashboard.vue'),
      meta: { role: 'customer' },
      props: true,
    },
    {
      path: '/dashboard/admin',
      component: () => import('../views/AdminDashboard.vue'),
      meta: { role: 'admin' },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.role) {
    await auth.hydrate()

    if (!auth.isAuthenticated) return '/'

    const userIdFromRoute = Number(to.params.userId)
    const userIdMatches = Number.isFinite(userIdFromRoute)
      ? Number(auth.user?.id) === userIdFromRoute
      : true

    if (!userIdMatches) {
      return auth.user?.role === 'admin'
        ? '/dashboard/admin'
        : `/dashboard/userid=${auth.user?.id ?? ''}`
    }

    if (auth.user?.role !== to.meta.role) {
      return auth.user?.role === 'admin' ? '/dashboard/admin' : `/dashboard/userid=${auth.user?.id ?? ''}`
    }
  }
})

export default router

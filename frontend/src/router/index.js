import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: () => import('../views/DashboardRouter.vue'),
    },
    {
      path: '/dashboard/:userId',
      component: () => import('../views/DashboardRouter.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.path === '/' && auth.token) {
    const user = await auth.hydrate()
    if (user) return `/dashboard/${user.id}`
  }

  if (to.path.startsWith('/dashboard')) {
    if (!auth.token) return '/'

    const user = await auth.hydrate()
    if (!user) return '/'

    if (to.path === '/dashboard') return `/dashboard/${user.id}`

    const requestedUserId = Number(to.params.userId)
    if (!requestedUserId || Number(user.id) !== requestedUserId) {
      return `/dashboard/${user.id}`
    }
  }
})

export default router

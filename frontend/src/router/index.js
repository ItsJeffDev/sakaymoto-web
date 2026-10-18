import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      redirect: () => {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return '/'
        return `/dashboard/${auth.user.id}`
      },
    },
    {
      path: '/dashboard/:userId',
      component: () => import('../views/DashboardRouter.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.path.startsWith('/dashboard')) {
    if (!auth.isAuthenticated) return '/'

    const requestedUserId = Number(to.params.userId)
    const authenticatedUserId = Number(auth.user?.id)

    if (!requestedUserId || authenticatedUserId !== requestedUserId) {
      return `/dashboard/${authenticatedUserId}`
    }
  }
})

export default router

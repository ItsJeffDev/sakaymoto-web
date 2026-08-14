import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Tracks whether the page has scrolled past a threshold,
 * so the header can switch from transparent to solid.
 */
export function useScrollHeader(threshold = 40) {
  const isScrolled = ref(false)

  function onScroll() {
    isScrolled.value = window.scrollY > threshold
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { isScrolled }
}

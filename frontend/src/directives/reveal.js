// v-reveal: adds the "in-view" class once an element scrolls into the
// viewport, then stops watching it. Mirrors the vanilla-JS IntersectionObserver
// from the original static page, but works safely with Vue's re-render cycle.

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default {
  mounted(el) {
    if (prefersReducedMotion) {
      el.classList.add('in-view')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    el.__revealObserver__ = io
  },
  unmounted(el) {
    if (el.__revealObserver__) {
      el.__revealObserver__.disconnect()
    }
  }
}

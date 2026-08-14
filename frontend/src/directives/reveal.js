// v-reveal: fades/slides an element in once it scrolls into view.
// Usage: <div v-reveal> ... </div>
// Respects prefers-reduced-motion via CSS (see assets/main.css .reveal rules).

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15 }
)

export const revealDirective = {
  mounted(el) {
    el.classList.add('reveal')
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  }
}

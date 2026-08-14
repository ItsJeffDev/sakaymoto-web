<script setup>
// Bespoke brand illustration (not part of the icon library) reused
// wherever a motorcycle silhouette is needed, with swappable colors.
defineProps({
  wheelColor: { type: String, default: '#2F6FED' },
  frameColor: { type: String, default: '#0B2545' }
})
</script>

<template>
  <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="46" cy="76" r="17" :stroke="wheelColor" stroke-width="4" />
    <circle cx="150" cy="76" r="17" :stroke="wheelColor" stroke-width="4" />
    <path d="M46 76 L84 46 H118 L150 76" :stroke="frameColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M84 46 L70 30 H56" :stroke="frameColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M118 46 L134 34" :stroke="frameColor" stroke-width="4" stroke-linecap="round" />
    <path d="M118 46 L128 62 H150" :stroke="frameColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="46" cy="76" r="4" :fill="wheelColor" />
    <circle cx="150" cy="76" r="4" :fill="wheelColor" />
  </svg>
</template>

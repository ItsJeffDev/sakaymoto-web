<script setup>
import { ref, computed } from 'vue'
import { bikes, filterOptions } from '../data/bikes'
import BikeCard from './BikeCard.vue'

const activeFilter = ref('All')

const filteredBikes = computed(() => {
  if (activeFilter.value === 'All') return bikes
  return bikes.filter((b) => b.category === activeFilter.value)
})
</script>

<template>
  <section
    class="section"
    id="browse"
    style="background:var(--bg-panel); border-top:1px solid var(--border-soft); border-bottom:1px solid var(--border-soft);"
  >
    <div class="container">
      <div class="catalog-head reveal" v-reveal>
        <div>
          <span class="eyebrow">Available now</span>
          <h2 style="margin-top:12px; font-size:clamp(24px,3vw,34px);">Pick your ride</h2>
        </div>
        <div class="filter-pills">
          <button
            v-for="option in filterOptions"
            :key="option"
            class="pill"
            :class="{ active: activeFilter === option }"
            @click="activeFilter = option"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="bike-grid" v-if="filteredBikes.length">
        <BikeCard v-for="bike in filteredBikes" :key="bike.id" :bike="bike" />
      </div>
      <p v-else style="color: var(--text-secondary); font-size: 15px;">
        No {{ activeFilter.toLowerCase() }} motorcycles available right now — check back soon.
      </p>
    </div>
  </section>
</template>

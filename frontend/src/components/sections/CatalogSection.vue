<script setup>
import { ref, computed } from 'vue'
import { motorcycles, catalogFilters } from '../../data/motorcycles'
import { useModalStore } from '../../stores/modal'
import MotoIcon from '../icons/MotoIcon.vue'

const modal = useModalStore()
const activeFilter = ref('all')

const filteredBikes = computed(() => {
  if (activeFilter.value === 'all') return motorcycles
  return motorcycles.filter((bike) => bike.category === activeFilter.value)
})

const accentBg = {
  blue: 'linear-gradient(160deg,#EAF1FF,#D6E4FF)',
  orange: 'linear-gradient(160deg,#FFF0E9,#FFE1D2)',
  navy: 'linear-gradient(160deg,#E7ECF5,#D3DBEA)',
}
const accentColor = {
  blue: '#2F6FED',
  orange: '#FF6A3D',
  navy: '#0B2545',
}
</script>

<template>
  <section class="section catalog" id="motorcycles">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="eyebrow">The Lineup</span>
        <h2 style=" color: var(--navy); ">Find a motorcycle for the ride you're actually making</h2>
        <p class="eyebrow-desc">
          Scooters for the daily commute, underbones for longer trips, and a few for whenever you
          want something quicker.
        </p>
      </div>

      <div class="filter-row" v-reveal>
        <button
          v-for="filter in catalogFilters"
          :key="filter.value"
          class="chip"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="bike-grid">
        <div class="bike-card" v-reveal v-for="bike in filteredBikes" :key="bike.id">
          <div class="bike-thumb" :style="{ background: accentBg[bike.accent] }">
            <span class="avail">Available</span>
            <MotoIcon :wheel-color="accentColor[bike.accent]" frame-color="#0B2545" />
          </div>
          <div class="bike-body">
            <span class="cat">{{ bike.categoryLabel }}</span>
            <h3>{{ bike.brand }} {{ bike.model }}</h3>
            <div class="bike-specs">
              <span v-for="spec in bike.specs" :key="spec">{{ spec }}</span>
            </div>
            <div class="bike-foot">
              <div class="price">
                <b>₱{{ bike.pricePerDay }}</b
                ><span>/ day</span>
              </div>
              <button class="btn btn-navy btn-sm" @click="modal.open('register')">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog {
  background: #fff;
}
.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 38px;
  flex-wrap: wrap;
}
.chip {
  padding: 10px 20px;
  border-radius: 999px;
  border: 1.5px solid var(--line);
  font-family: var(--ff-display);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--ink-soft);
  transition: all 0.2s;
}
.chip.active,
.chip:hover {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}

.bike-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}
.bike-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: #fff;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}
.bike-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow);
}
.bike-thumb {
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.bike-thumb :deep(svg) {
  width: 68%;
}
.bike-thumb .avail {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.92);
  color: #178a4c;
  font-family: var(--ff-display);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.bike-thumb .avail::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
}

.bike-body {
  padding: 22px;
}
.bike-body .cat {
  font-size: 0.72rem;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: var(--ff-display);
  font-weight: 600;
}
.bike-body h3 {
  font-size: 1.15rem;
  margin: 6px 0 12px;
}
.bike-specs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.bike-specs span {
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 0.72rem;
  padding: 5px 10px;
  border-radius: 8px;
}
.bike-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bike-foot .price b {
  font-family: var(--ff-display);
  color: var(--navy);
  font-size: 1.25rem;
}
.bike-foot .price span {
  color: var(--ink-soft);
  font-size: 0.78rem;
}

@media (max-width: 980px) {
  .bike-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 760px) {
  .bike-grid {
    grid-template-columns: 1fr;
  }
}
</style>

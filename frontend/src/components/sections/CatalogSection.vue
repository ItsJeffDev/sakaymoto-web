<script setup>
import { ref, computed, onMounted } from 'vue'
import { motorcycles as fallbackMotorcycles, catalogFilters } from '../../data/motorcycles'
import { useModalStore } from '../../stores/modal'
import { api } from '../../services/api'
import MotoIcon from '../icons/MotoIcon.vue'

const modal = useModalStore()
const activeFilter = ref('all')
const motorcycles = ref([])
const isLoading = ref(true)
const loadError = ref('')
const previewBike = ref(null)
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/api$/,
  '',
)

function getBikeImageUrl(bike) {
  const images = Array.isArray(bike.images) ? bike.images : []
  const image = images.find((item) => item.is_primary) || images[0]

  if (!image?.image_url) return ''
  return image.image_url.startsWith('http') ? image.image_url : `${apiBaseUrl}${image.image_url}`
}

async function loadMotorcycles() {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await api.motorcycles()
    motorcycles.value = response
      .filter((bike) => (bike.status || 'available') !== 'inactive')
      .map((bike) => ({
        ...bike,
        pricePerDay: Number(bike.price_per_day),
        category: 'all',
        categoryLabel: `${bike.brand} · ${bike.color}`,
        specs: [
          `${bike.year}`,
          bike.color,
          bike.status === 'maintenance' ? 'Under maintenance' : 'Available to book',
        ],
        accent: 'blue',
      }))
  } catch (error) {
    loadError.value = error.message
    motorcycles.value = fallbackMotorcycles.filter(
      (bike) => (bike.status || 'available') !== 'inactive',
    )
  } finally {
    isLoading.value = false
  }
}

const filteredBikes = computed(() => {
  if (activeFilter.value === 'all') return motorcycles.value
  return motorcycles.value.filter((bike) => bike.category === activeFilter.value)
})

onMounted(loadMotorcycles)

function openPreview(bike) {
  previewBike.value = bike
}

function closePreview() {
  previewBike.value = null
}

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
        <h2 style="color: var(--navy)">Find a motorcycle for the ride you're actually making</h2>
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

      <p v-if="isLoading" class="catalog-state">Loading available motorcycles...</p>
      <p v-else-if="loadError" class="catalog-state error">
        Live catalog unavailable. Showing saved catalog data.
      </p>
      <p v-else-if="!filteredBikes.length" class="catalog-state">
        No motorcycles are available right now.
      </p>
      <div v-else class="bike-grid">
        <div class="bike-card" v-reveal v-for="bike in filteredBikes" :key="bike.id">
          <div
            class="bike-thumb"
            :style="{ background: accentBg[bike.accent] }"
            @click="openPreview(bike)"
            @keydown.enter.prevent="openPreview(bike)"
            @keydown.space.prevent="openPreview(bike)"
            role="button"
            tabindex="0"
            :aria-label="`Preview motorcycle ${bike.brand} ${bike.model}`"
          >
            <span class="avail" :class="{ maintenance: bike.status === 'maintenance' }">
              {{ bike.status === 'maintenance' ? 'Maintenance' : 'Available' }}
            </span>
            <img
              v-if="getBikeImageUrl(bike)"
              class="bike-image"
              :src="getBikeImageUrl(bike)"
              :alt="`${bike.brand} ${bike.model}`"
            />
            <MotoIcon v-else :wheel-color="accentColor[bike.accent]" frame-color="#0B2545" />
            <button class="preview-pill" type="button" @click.stop="openPreview(bike)">
              Preview
            </button>
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
              <button
                class="btn btn-navy btn-sm"
                type="button"
                :disabled="(bike.status || 'available') !== 'available'"
                @click="modal.open('login')"
              >
                {{ (bike.status || 'available') === 'available' ? 'Book Now' : 'Unavailable' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="previewBike" class="preview-overlay" @click.self="closePreview()">
        <div class="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="bike-preview-title">
          <button class="dialog-close" type="button" aria-label="Close preview" @click="closePreview()">
            ×
          </button>
          <div class="preview-visual">
            <img
              v-if="getBikeImageUrl(previewBike)"
              :src="getBikeImageUrl(previewBike)"
              :alt="`${previewBike.brand} ${previewBike.model}`"
            />
            <MotoIcon v-else :wheel-color="accentColor[previewBike.accent]" frame-color="#0B2545" />
          </div>
          <div class="preview-content">
            <span class="eyebrow">Motorcycle preview</span>
            <h3 id="bike-preview-title">{{ previewBike.brand }} {{ previewBike.model }}</h3>
            <p>{{ previewBike.categoryLabel }}</p>
            <div class="bike-specs preview-specs">
              <span v-for="spec in previewBike.specs" :key="spec">{{ spec }}</span>
            </div>
            <div class="preview-actions">
              <button
                class="btn btn-primary"
                type="button"
                @click="closePreview(); modal.open('login')"
              >
                Login to reserve
              </button>
              <button class="btn btn-secondary" type="button" @click="closePreview()">Close</button>
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
.catalog-state {
  color: var(--ink-soft);
  font-size: 0.9rem;
  padding: 24px 0;
}
.catalog-state.error {
  color: #a96c11;
}
.dialog-close {
  position: absolute;
  top: 14px;
  right: 16px;
  color: var(--ink-soft);
  font-size: 1.4rem;
}
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1600;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(8, 27, 54, 0.66);
}
.preview-dialog {
  width: min(100%, 760px);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 0;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 25px 70px -25px rgba(8, 27, 54, 0.5);
}
.preview-visual {
  min-height: 340px;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, #edf4ff, #dfeaff);
}
.preview-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.preview-visual :deep(svg) {
  width: 64%;
}
.preview-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 28px 26px 24px;
}
.preview-content h3 {
  font-size: 1.7rem;
  line-height: 1.15;
  margin-top: -6px;
}
.preview-content p {
  color: var(--ink-soft);
  margin-top: -6px;
}
.preview-specs {
  margin: 0;
}
.preview-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.btn-secondary {
  background: #f3f6fb;
  color: var(--navy);
  border: 1px solid var(--line);
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
  overflow: hidden;
  cursor: pointer;
}
.bike-thumb :deep(svg) {
  width: 68%;
}
.bike-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.preview-pill {
  position: absolute;
  right: 14px;
  bottom: 14px;
  border: 0;
  border-radius: 999px;
  background: rgba(11, 37, 69, 0.9);
  color: #fff;
  font: 600 0.7rem var(--ff-display);
  padding: 7px 12px;
  box-shadow: 0 12px 24px rgba(11, 37, 69, 0.2);
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
  .preview-dialog {
    grid-template-columns: 1fr;
  }
  .preview-visual {
    min-height: 260px;
  }
}
@media (max-width: 760px) {
  .bike-grid {
    grid-template-columns: 1fr;
  }
  .preview-dialog {
    width: min(100%, 480px);
  }
  .preview-content {
    padding: 22px 18px 20px;
  }
  .preview-actions {
    flex-direction: column;
  }
  .preview-actions .btn {
    width: 100%;
  }
}
</style>

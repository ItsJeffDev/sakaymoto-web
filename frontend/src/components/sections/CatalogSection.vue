<script setup>
import { ref, computed, onMounted } from 'vue'
import { motorcycles as fallbackMotorcycles, catalogFilters } from '../../data/motorcycles'
import { useModalStore } from '../../stores/modal'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'
import MotoIcon from '../icons/MotoIcon.vue'

const modal = useModalStore()
const auth = useAuthStore()
const activeFilter = ref('all')
const motorcycles = ref([])
const isLoading = ref(true)
const loadError = ref('')
const selectedBike = ref(null)
const bookingForm = ref({ start_date: '', end_date: '' })
const bookingError = ref('')
const bookingSuccess = ref('')
const isBooking = ref(false)

async function loadMotorcycles() {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await api.motorcycles()
    motorcycles.value = response.map((bike) => ({
      ...bike,
      pricePerDay: Number(bike.price_per_day),
      category: 'all',
      categoryLabel: `${bike.brand} · ${bike.color}`,
      specs: [`${bike.year}`, bike.color, 'Available to book'],
      accent: 'blue',
    }))
  } catch (error) {
    loadError.value = error.message
    motorcycles.value = fallbackMotorcycles
  } finally {
    isLoading.value = false
  }
}

const filteredBikes = computed(() => {
  if (activeFilter.value === 'all') return motorcycles.value
  return motorcycles.value.filter((bike) => bike.category === activeFilter.value)
})

onMounted(loadMotorcycles)

function openBooking(bike) {
  if (!auth.isAuthenticated) {
    modal.open('login')
    return
  }
  selectedBike.value = bike
  bookingForm.value = { start_date: '', end_date: '' }
  bookingError.value = ''
  bookingSuccess.value = ''
}

async function submitBooking() {
  bookingError.value = ''
  bookingSuccess.value = ''
  if (
    !bookingForm.value.start_date ||
    !bookingForm.value.end_date ||
    bookingForm.value.end_date < bookingForm.value.start_date
  ) {
    bookingError.value = 'Choose a valid start and end date.'
    return
  }
  isBooking.value = true
  try {
    const response = await api.booking({
      motorcycle_id: selectedBike.value.id,
      ...bookingForm.value,
    })
    bookingSuccess.value = `${response.message}. Total: PHP ${Number(response.total_price).toLocaleString()}`
  } catch (error) {
    bookingError.value = error.message
  } finally {
    isBooking.value = false
  }
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
              <button class="btn btn-navy btn-sm" type="button" @click="openBooking(bike)">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedBike" class="booking-overlay" @click.self="selectedBike = null">
        <form class="booking-dialog" @submit.prevent="submitBooking">
          <button
            class="dialog-close"
            type="button"
            aria-label="Close booking form"
            @click="selectedBike = null"
          >
            ×</button
          ><span class="eyebrow">Booking request</span>
          <h3>{{ selectedBike.brand }} {{ selectedBike.model }}</h3>
          <p>Select your rental dates. The request will be reviewed by SakayMoto.</p>
          <label>Start date<input v-model="bookingForm.start_date" type="date" required /></label
          ><label>End date<input v-model="bookingForm.end_date" type="date" required /></label>
          <p v-if="bookingError" class="booking-message error">{{ bookingError }}</p>
          <p v-if="bookingSuccess" class="booking-message success">{{ bookingSuccess }}</p>
          <button
            class="btn btn-primary btn-block"
            type="submit"
            :disabled="isBooking || !!bookingSuccess"
          >
            {{
              isBooking
                ? 'Submitting...'
                : bookingSuccess
                  ? 'Request submitted'
                  : 'Submit booking request'
            }}
          </button>
        </form>
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
.booking-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(8, 27, 54, 0.58);
}
.booking-dialog {
  width: min(100%, 440px);
  display: grid;
  gap: 14px;
  padding: 30px;
  position: relative;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 25px 70px -25px rgba(8, 27, 54, 0.5);
}
.booking-dialog h3 {
  font-size: 1.35rem;
  margin-top: -6px;
}
.booking-dialog > p {
  color: var(--ink-soft);
  font-size: 0.82rem;
  margin-top: -7px;
}
.booking-dialog label {
  display: grid;
  gap: 6px;
  color: var(--navy);
  font: 600 0.77rem var(--ff-display);
}
.booking-dialog input {
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 9px;
  font: 400 0.85rem var(--ff-body);
}
.dialog-close {
  position: absolute;
  top: 14px;
  right: 16px;
  color: var(--ink-soft);
  font-size: 1.4rem;
}
.booking-message {
  padding: 9px 11px;
  border-radius: 8px;
  font-size: 0.76rem;
}
.booking-message.error {
  color: #a33b32;
  background: #fff0ed;
}
.booking-message.success {
  color: #18734d;
  background: #e7f7ef;
}
.booking-dialog .btn:disabled {
  opacity: 0.65;
  cursor: wait;
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
